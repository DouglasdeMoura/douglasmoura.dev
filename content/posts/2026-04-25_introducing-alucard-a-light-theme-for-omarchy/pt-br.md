---
title: "Apresentando Alucard: um tema claro para Omarchy"
slug: introducing-alucard-a-light-theme-for-omarchy
locale: pt-BR
created: 2026-04-25 14:20:55.468Z
updated: 2026-04-25 23:23:40.000Z
tags:
  - Linux
  - Omarchy
  - Theme
---
Desde janeiro, eu tenho usado meu próprio tema claro para [Omarchy](https://github.com/basecamp/omarchy) (você usa Linux e ainda não conhece Omarchy? Vá conferir!) e eu esqueci de fazer um anúncio oficial! Então, sim, este post atrasado é uma tentativa de retificar este erro.

## Alucard: um tema claro para Omarchy (e o arqui-inimigo de Dracula)

Eu sou um fã ardoroso do [Dracula theme](https://draculatheme.com/) e tenho o usado por anos. E, como você deve ter adivinhado, eu tenho usado tudo que eu podia com um tema escuro. Mas, eu me mudei para uma casa nova, que é super iluminada pelo sol ao longo do dia atraves janelas enormes e, usar temas escuros com tanta luz natural provou ser uma tarefa difícil. Omarchy (minha distro Linux de escolha) vem muito bem servida de belos [temas](https://learn.omacom.io/2/the-omarchy-manual/52/themes?search=theme) e eu comecei a usar ou Flexoki Light ou Catppuccin Latte durante o dia. Ainda assim, nenhum dos dois era bem do meu gosto e eu sabia que já havia uma versão clara do tema Dracula chamada Alucard que era oferecida pelo pacote Pro deles. Quando fui ao site deles para conferir, descobri uma [especificação](https://draculatheme.com/spec) bastante completa para o Dracula e o Alucard theme, então, fiz o que qualquer desenvolvedor que ama open source faz: cocei minha própria coceira, quero dizer, comecei a trabalhar no tema Alucard para Omarchy e tenho o usado todos os dias desde janeiro.


![Captura de tela do Alucard theme no Omarchy com a saída de ls no topo à esquerda, nvim com Lazyvim aberto na parte inferior à esquerda e btop em execução à direita](./img/omarchy-alucard-theme-preview.png)

## O caminho para fazer tudo funcionar lindamente

Quando comecei a investigar a especificação e construir o tema, descobri que muitas aplicações (Alacritty, btop, Chromium, Ghostty e Kitty) não tinham temas Alucard oficiais, então comecei a construí-los eu mesmo (ainda tenho que criar repositórios individuais para eles e abrir um PR para a equipe do Dracula, farei isso em breve). Levou algumas iterações para eu ficar satisfeito com as combinações de cores, mas tudo funcionou lindamente.

## Os wallpapers

Atualmente, o tema é distribuído com três wallpapers: Dracula Waves, Dracula Mountain e Dracula Galaxy, todos tirados do repositório oficial de [Dracula wallpapers](https://github.com/dracula/wallpaper). Eu simplesmente amo o wallpaper Dracula Waves e é por isso que ele é a primeira escolha quando você instala o tema.

![Wallpaper Dracula Waves](./img/1-dracula-waves-bd93f9.png)
![Wallpaper Dracula Mountains](./img/2-dracula-mnt-bd93f9.png)
![Wallpaper Dracula Galaxy](./img/3-dracula-galaxy-6272a4.png)

## O repositório

Todo o código está disponível em [douglasdemoura/omarchy-alucard-theme](https://github.com/DouglasdeMoura/omarchy-alucard-theme). Sinta-se à vontade para enviar seu feedback e contribuições para torná-lo ainda melhor.

## A instalação

Se você está usando Omarchy, você pode instalar o Alucard theme com o comando abaixo:

```bash
omarchy-theme-install https://github.com/douglasdemoura/omarchy-alucard-theme
```
