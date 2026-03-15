---
title: Instalando o WhatsApp no Linux
slug: instalando-o-whats-app-no-linux
locale: pt-BR
created: 2024-07-29 17:18:23.361Z
updated: 2024-07-29 17:34:53.815Z
tags:
  - WhatsApp
  - Linux
  - Ubuntu
cover: ./cover.jpg
type: post
---

Infelizmente, o WhatsApp não fornece um aplicativo oficial para o Linux. Felizmente, se você tem o [Google Chrome](https://www.google.com/intl/pt-BR/chrome/) ou o Chromium instalado no seu computador, você pode instalar a página como uma aplicação. Siga os passos abaixo:

### 1. Baixe um ícone para a sua aplicação

Eu, por exemplo, escolhi [este](https://github.com/mimbrero/whatsapp-desktop-linux/blob/main/data/icons/hicolor/512x512/apps/io.github.mimbrero.WhatsAppDesktop.png) ícone para o WhatsApp no meu computador. Se quiser utilizar o mesmo, execute o seguinte comando no terminal:

```bash
ICON_INSTALLATION_DIR=~/.local/share/web-apps/icons && mkdir -p $ICON_INSTALLATION_DIR && wget https://raw.githubusercontent.com/mimbrero/whatsapp-desktop-linux/main/data/icons/hicolor/512x512/apps/io.github.mimbrero.WhatsAppDesktop.png -P $ICON_INSTALLATION_DIR/WhatsApp.png
```

O comando acima irá criar o diretório `~/.local/share/web-apps` e baixará o ícone do WhatsApp.

### 2. Crie o [_desktop entry_](https://wiki.archlinux.org/title/Desktop_entries) da aplicação

Para criar o arquivo [_desktop entry_](https://wiki.archlinux.org/title/Desktop_entries) da aplicação, execute o seguinte comando:

```bash
cat <<EOF >~/.local/share/applications/WhatsApp.desktop
[Desktop Entry]
Version=1.0
Name=WhatsApp
Comment=WhatsApp Messenger
Exec=google-chrome --app="https://web.whatsapp.com" --name=WhatsApp --class=Whatsapp
Terminal=false
Type=Application
Icon=/home/$USER/.local/share/web-apps/icons/WhatsApp.png
Categories=GTK;
MimeType=text/html;text/xml;application/xhtml_xml;
StartupNotify=true
StartupWMClass=Whatsapp
EOF
```

Agora, o WhatsApp estará disponível no menu do seu sistema. No meu Ubuntu 24.04 ficou assim:

![Meu dash do Gnome](https://pocketbase.douglasmoura.dev/api/files/quq9xznky3sx782/8ka7cdr3iet8iqf/screenshot_from_2024_07_29_14_25_00_3M0OyL4OCK.png)
