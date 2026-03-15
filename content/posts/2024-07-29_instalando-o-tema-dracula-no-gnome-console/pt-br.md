---
title: Instalando o tema Dracula no Gnome Console
slug: instalando-o-tema-dracula-no-gnome-console
locale: pt-BR
created: 2024-07-29 17:55:16.247Z
updated: 2024-07-29 17:55:16.247Z
tags:
  - Linux
  - Ubuntu
cover: ./cover.jpg
type: post
---

O tema [Dracula](https://draculatheme.com/) criado pelo brasileiro [Zeno Rocha](https://x.com/zenorocha) é o tema que mais gosto de usar nas minhas ferramentas de trabalho (VS Code, NeoVim, etc.). Enquanto estava preparando meu ambiente de trabalho no Ubuntu, decidi experimentar o novo [Gnome Console](https://apps.gnome.org/Console/) e gostei muito. Infelizmente, ele não tem uma opção de configurar temas de cores, mas, ainda assim, é possível fazer isso configurando as [`dircolors`](https://www.gnu.org/software/coreutils/manual/html_node/dircolors-invocation.html) e alterando a cor de fundo do terminal executando `echo -ne '\e]11;#282A36\e\\'` (note que `#282A36` é a [cor de fundo](https://draculatheme.com/contribute) do tema Dracula).

Para isso, vamos baixar as `dircolors` do [site oficial](https://draculatheme.com/dircolors):

```bash
wget https://raw.githubusercontent.com/dracula/dircolors/main/.dircolors -P ~/.dircolors
```

Agora, adicione `echo -ne '\e]11;#282A36\e\\'` no seu `.bashrc` (se você usa o Bash), `.zshrc` (se você usa ZSH) e/ou `.config/fish/config.fish` (se você, como eu, usa o Fish Shell).
