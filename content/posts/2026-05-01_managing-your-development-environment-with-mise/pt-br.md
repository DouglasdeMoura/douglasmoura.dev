---
title: "Gerenciando seu ambiente de desenvolvimento com Mise (e entendendo shims!)"
slug: gerenciando-seu-ambiente-de-desenvolvimento-com-mise
locale: pt-BR
created: 2026-05-01 12:13:37.281Z
updated: 2026-05-01 18:59:33.000Z
tags:
  - Ferramentas de Desenvolvimento
  - Ambiente
  - Linguagens
---

Eu já passei muitas vezes por este cenário: começamos um projeto novo com a versão mais recente de uma linguagem de programação, mas ainda precisamos manter uma aplicação legada que usa uma versão mais antiga da mesma linguagem. Às vezes estou trabalhando em um projeto que usa a versão <abbr title="Long Term Support">LTS</abbr>, mas quero testar a versão nightly mais recente em paralelo. Praticamente toda linguagem tem algum tipo de ferramenta para lidar com isso, como [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), [n](https://github.com/mklement0/n-install) ou [volta](https://volta.sh/) para Node.js, [pyenv](https://github.com/pyenv/pyenv) para Python, [rbenv](https://github.com/rbenv/rbenv) para Ruby, [goenv](https://github.com/go-nv/goenv) para Go, e assim por diante. Também existem soluções poliglotas, que funcionam para várias linguagens, como [ASDF](https://asdf-vm.com/) e a minha favorita, [Mise](https://mise.jdx.dev/).

## A ferramenta

Mise é um projeto solo de Jeff Dickey, um desenvolvedor baseado em Dallas que mantém várias ferramentas open source (confira o [site dele](https://jdx.dev/) para ver no que ele está trabalhando). Além de gerenciar versões de linguagens de programação, Mise consegue configurar variáveis de ambiente e executar tarefas específicas do projeto usando as versões configuradas das ferramentas. Você também não fica preso às convenções dele: se quiser continuar usando o arquivo de versão que o seu projeto já tem, como `.nvmrc` ou `.node-version` para Node.js, o Mise vai respeitá-lo.

## O funcionamento interno

Em termos simples, o Mise instala os binários da linguagem de programação selecionada e intercepta as suas chamadas para essa linguagem usando shims.

<aside data-alert data-color="blue" role="note">
<strong>O que é um shim?</strong>
Um shim é uma pequena camada de compatibilidade que intercepta uma chamada, lida com ela diretamente ou a redireciona para outro lugar. Você pode pensar nele como um proxy.
</aside>

Para ter uma ideia de como isso funciona, vamos implementar um shim bem básico para gerenciar Node.js.

### Linux e Bash

Primeiro, baixe os binários standalone do Node.js [aqui](https://nodejs.org/en/download/). Use os arquivos `.tar.xz`. Extraia os arquivos e mova os diretórios extraídos para `~/.nodejs`. Esse diretório deve ficar mais ou menos assim:

```bash
node-v24.15.0-linux-x64
node-v25.9.0-linux-x64
```

Este exemplo em Bash também funciona no macOS. A única diferença importante é o sufixo da plataforma no diretório extraído do Node.js e na linha `binary_path`: use `darwin-arm64` em Macs com Apple Silicon ou `darwin-x64` em Macs com Intel. Por exemplo:

```bash
binary_path="$dir/node-v$version-darwin-arm64/bin/node"
```

Agora, vamos criar um diretório para os nossos testes: `mkdir ~/shim-example`. Depois, vamos adicionar um arquivo que informa ao shim qual versão do Node.js queremos usar nesse diretório. Execute:

```bash
echo "24.15.0" > ~/shim-example/.node-version
```

Por fim, vamos criar o script Bash que vai selecionar a versão do Node.js que queremos:

```bash
#!/usr/bin/env bash

# Faz o script encerrar quando: um comando falha (-e), uma variável não foi definida (-u), qualquer comando em um pipeline falha (-o pipefail)
set -euo pipefail

# Define o diretório onde você vai salvar todos os binários do Node.js que quiser usar
dir="$HOME/.nodejs"

if [ ! -f .node-version ]; then
  echo "Nenhuma versão do Node.js definida. Crie um arquivo .node-version e escreva a versão desejada."
  exit 1
fi

# Lê o arquivo .node-version para selecionar a versão desejada do Node.js
version=$(cat .node-version)

if [ -z "$version" ]; then
  echo "Nenhuma versão do Node.js definida. Escreva a versão desejada em .node-version."
  exit 1
fi

binary_path="$dir/node-v$version-linux-x64/bin/node"

if [ ! -f "$binary_path" ]; then
  echo "Node.js $version não está instalado em $dir. Acesse https://nodejs.org/en/download, baixe um binário standalone e extraia em $dir."
  exit 1
fi

exec "$binary_path" "$@"
```

Salve esse script Bash como `node`, depois mova-o para `~/.local/bin` e torne-o executável:

```bash
mkdir -p ~/.local/bin
mv node ~/.local/bin/node
chmod +x ~/.local/bin/node
```

Esse diretório provavelmente já estará no seu `$PATH`. Você pode conferir com:

```bash
printf '%s\n' "$PATH" | tr ':' '\n' | grep -Fx "$HOME/.local/bin"
```

Se nada for retornado, você deve adicionar esse diretório ao seu `$PATH`. Garanta que ele apareça antes de qualquer outro diretório que contenha um executável `node`. Para verificar se tudo deu certo, execute `command -v node`. Você deve ver a seguinte saída:

```bash
$ command -v node
/home/your-username/.local/bin/node
```

Agora, execute `node --version` dentro do diretório `~/shim-example`. Você deve ver `v24.15.0`. Altere a versão em `.node-version` para 25.9.0 (`echo "25.9.0" > .node-version`) e execute `node --version` novamente. Você deve ver a nova versão do Node.js ativada nesse diretório.

### Windows e PowerShell

No Windows, baixe os binários standalone `.zip` na mesma página de download do Node.js. Extraia-os em `$HOME\.nodejs`. Esse diretório deve ficar mais ou menos assim:

```powershell
node-v24.15.0-win-x64
node-v25.9.0-win-x64
```

Crie o diretório de teste e o arquivo `.node-version`:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\shim-example"
Set-Content -Path "$HOME\shim-example\.node-version" -Value "24.15.0"
```

Depois crie este shim em PowerShell:

```powershell
$ErrorActionPreference = "Stop"

$versionsDir = Join-Path $HOME ".nodejs"
$versionFile = Join-Path (Get-Location) ".node-version"

if (-not (Test-Path -LiteralPath $versionFile -PathType Leaf)) {
  Write-Error "Nenhuma versão do Node.js definida. Crie um arquivo .node-version e escreva a versão desejada."
  exit 1
}

$version = (Get-Content -LiteralPath $versionFile -Raw).Trim()

if ([string]::IsNullOrWhiteSpace($version)) {
  Write-Error "Nenhuma versão do Node.js definida. Escreva a versão desejada em .node-version."
  exit 1
}

$versionDir = Join-Path $versionsDir "node-v$version-win-x64"
$binaryPath = Join-Path $versionDir "node.exe"

if (-not (Test-Path -LiteralPath $binaryPath -PathType Leaf)) {
  Write-Error "Node.js $version não está instalado em $versionsDir. Acesse https://nodejs.org/en/download, baixe um binário standalone e extraia em $versionsDir."
  exit 1
}

& $binaryPath @args
exit $LASTEXITCODE
```

Salve-o como `node.ps1` em um diretório que esteja no seu path do PowerShell. Por exemplo:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\bin"
Move-Item -Path .\node.ps1 -Destination "$HOME\bin\node.ps1" -Force
```

Se `$HOME\bin` ainda não estiver no seu path, adicione-o para o seu usuário. Coloque-o antes do path existente para que esse shim tenha prioridade sobre qualquer outra instalação do Node.js:

```powershell
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$HOME\bin;$userPath", "User")
```

Abra uma nova sessão do PowerShell para que ela carregue o path atualizado. Depois confira se o PowerShell encontra o shim:

```powershell
Get-Command node
```

Por fim, execute `node --version` dentro de `$HOME\shim-example`. Você deve ver `v24.15.0`. Altere a versão em `.node-version` para 25.9.0 (`Set-Content -Path .\.node-version -Value "25.9.0"`) e execute `node --version` novamente.

O Mise faz tudo isso, e um pouco mais, usando Rust. Ainda assim, este exemplo deve dar uma ideia bem clara de como ele funciona.

## Instalando e configurando o Mise

Existem muitas formas de instalar o Mise, então recomendo ir direto à [documentação](https://mise.jdx.dev/getting-started.html). Depois de instalar e configurar o Mise, instale as ferramentas de que você [precisa](https://mise.jdx.dev/core-tools.html). Pessoalmente, eu não uso o arquivo de configuração do Mise (`mise.toml`) nos projetos Node.js em que trabalho, porque algumas pessoas do time usam ferramentas diferentes. Em vez disso, adiciono a versão do Node.js em `.node-version`, que é suportado por um grande número de ferramentas similares.
