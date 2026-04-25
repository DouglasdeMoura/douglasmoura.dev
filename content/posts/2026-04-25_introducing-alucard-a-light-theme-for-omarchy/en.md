---
title: "Introducing Alucard: a light theme for Omarchy"
slug: introducing-alucard-a-light-theme-for-omarchy
locale: en-US
created: 2026-04-25 14:20:55.468Z
updated: 2026-04-25 23:11:04.000Z
tags:
  - Linux
  - Omarchy
  - Theme
---
Since January, I've been using my own light theme for [Omarchy](https://github.com/basecamp/omarchy) (do you use Linux and don't know Omarchy yet? Go check it out!) and I forgot to make an official announcement! So, yes, this late post is an attempt to rectify this mistake.

## Alucard: a light theme for Omarchy (and the arch-enemy of Dracula)

I'm a die hard fan of the [Dracula theme](https://draculatheme.com/) and I have been using it for years. And, as you might have guessed, I've been using everything I could with a dark theme. But, I have moved to a new house, which is super illuminated by the sun throughout the day with massive windows and, using dark themes with so much natural light proved to be a difficult task. Omarchy (my Linux distro of choice) comes very well served of beautiful [themes](https://learn.omacom.io/2/the-omarchy-manual/52/themes?search=theme) and I started to use either Flexoki Light or Catppuccin Latte during the day. Yet, neither were quite my taste and I knew there were already a light version of the Dracula theme called Alucard that was offered by their Pro package. When I went to their website to check it out, I found out a quite complete [specification](https://draculatheme.com/spec) for the Dracula and the Alucard theme, so, I did what any developer who loves open source do: I scratched my own itch, I mean, I started working on the Alucard theme for Omarchy and I have been using it everyday since January.


![Screenshot of the Alucard theme on Omarchy with the output of ls on the top left, nvim with Lazyvim opened on the bottom left and btop running on the right](./img/omarchy-alucard-theme-preview.png)

## The road to get everything working beautifully

When I started digging into the specification and building the theme, I found out a lot of applications (Alacritty, btop, Chromium, Ghostty, and Kitty) didn't had official Alucard themes, so I started building them myself (I yet have to create single repositories for them and open a PR to the Dracula team, I'll be doing it shortly). It took a few iterations for me to get satisfied with the color combinations, but everything worked beautifully.

## The wallpapers

Currenttly, the theme is distributed with three wallpapers: Dracula Waves, Dracula Mountain, and Dracula Galaxy, all of which were taken from the official [Dracula wallpapers](https://github.com/dracula/wallpaper) repository. I simply love the Dracula Waves walppaper and that's why it's the first choice when you install the theme.

![Dracula Waves Wallpaper](./img/1-dracula-waves-bd93f9.png)
![Dracula Mountains Wallpaper](./img/2-dracula-mnt-bd93f9.png)
![Dracula Galaxy Wallpaper](./img/3-dracula-galaxy-6272a4.png)

## The repository

All the code is available at [douglasdemoura/omarchy-alucard-theme](https://github.com/DouglasdeMoura/omarchy-alucard-theme). Feel free to send your feedback and contributions to make it event better.

## The installation

If you are using Omarchy, you can install the Alucard theme with the command below:

```bash
omarchy-theme-install https://github.com/douglasdemoura/omarchy-alucard-theme
```
