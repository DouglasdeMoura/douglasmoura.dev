---
title: Corrigindo a configuração do teclado americano no Ubuntu
slug: corrigindo-a-configuracao-do-teclado-americano-no-ubuntu-24-04
locale: pt-BR
created: 2024-07-29 13:26:35.627Z
updated: 2026-01-18 14:23:29.780Z
tags:
  - Ubuntu
  - Linux
  - Dicas
cover: ./cover.jpg
type: post
---

Neste fim de semana, troquei meu Macbook Air M1 (com o qual precisava lutar com o pouco armazenamento de 256 GB) por um Dell G3 3579 (onde fiz um upgrade para ter 40 GB de RAM, 500 GB SSD M.2 e um SSD de 1 TB) e, logo após instalar o Ubuntu 24.04, eu não estava conseguindo digitar o ç no me teclado Keychron K2 v.2 (sempre que tentava digitar um ç, me aparecia um ć).

Acontece que, ao invés de digitar <kbd>'</kbd> + <kbd>c</kbd>, para obter o <kbd>ç</kbd>, teria que digitar <kbd>Alt Grd</kbd> + <kbd>,</kbd><kbd>c</kbd>. Como não queria me adaptar à essa mudança, fiz uma rápida pesquisa e descobri que a solução é adicionar a variável de ambiente `GTK_IM_MODULE=cedilla` no arquivo `/etc/environment` ([afetando todos os usuários do sistema](https://help.ubuntu.com/community/EnvironmentVariables)) ou no arquivo `~/.profile` (o que afeta apenas o seu usuário). Para corrigir o problema para todos os usuários do computador, eu anexei essa variável de ambiente ao fim do arquivo `/etc/environment` da seguinte maneira:

```bash
sudo sh -c 'echo "GTK_IM_MODULE=cedilla" >> /etc/environment'
```

Depois disso, reinicie sua sessão de usuário (_logout_ e _login_) ou reinicie o computador.

---

## Fonte

[Ask Ubuntu](https://askubuntu.com/questions/1291492/cedilha-getting-%C4%87-rather-than-%C3%A7-after-upgrade-to-20-10)
