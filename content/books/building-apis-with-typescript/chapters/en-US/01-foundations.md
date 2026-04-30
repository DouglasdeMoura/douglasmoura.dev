---
title: Installing Node.js
slug: installing-node-js
locale: en-US
order: 1
created: 2026-04-28 16:30:00.000Z
updated: 2026-04-28 16:30:00.000Z
---

There are multiple ways to install Node.js on any operating system you like. In this book, I'll use [Mise](https://mise.jdx.dev/getting-started.html) because I think it is the best tool for developers. Mise enables you to manage multiple programming languages, environment variables, and tasks per project. This allows you to have multiple versions of the same programming language installed on your computer at the same time and choose the right version for each project.

Mise can do a lot more than manage Node.js versions, so it is worth spending some time learning its capabilities in the [documentation](https://mise.jdx.dev/getting-started.html).

## Installing on Windows

Since Windows 10 version 1809 (build 17763), Windows users have access to [WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget/), a command-line tool for installing and managing applications. On modern Windows machines, open PowerShell or Terminal and install [Mise](https://mise.jdx.dev/) with WinGet:

```pwsh
winget install jdx.mise
```

Restart PowerShell and verify the installation:

```pwsh
mise --version
```

Now, activate Mise for PowerShell. This command creates the profile directory if it does not exist and adds the activation line to your PowerShell profile:

```pwsh
New-Item -ItemType Directory -Force (Split-Path $PROFILE)
Add-Content $PROFILE '(&mise activate pwsh) | Out-String | Invoke-Expression'
```

Restart PowerShell again and install the latest LTS version of Node.js:

```pwsh
mise use --global node@lts
```

Finally, verify the Node.js and npm installations:

```pwsh
node --version
npm --version
```

You may see a message like `npm : File C:\Users\you\AppData\Local\mise\shims\npm.ps1 cannot be loaded because running scripts is disabled on this system`. This happens because PowerShell's [execution policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.6) is blocking local unsigned scripts. To run scripts on Windows, the execution policy must be set, at minimum, to `RemoteSigned`. To do that, run this command in PowerShell:

```pwsh
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

You can also install Node.js on your Windows machine through [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows Subsystem for Linux), which gives you a Linux environment inside Windows. Follow Microsoft's official WSL documentation, then use the Linux instructions in the next section.

## Installing on Linux and macOS

To install Mise, open your terminal and run:

```bash
curl https://mise.run | sh
```

Check the installation:

```bash
mise --version
```

Now, activate Mise for your shell. Tip: run `echo $SHELL` to discover your default shell. Normally, it is Bash on Linux and Zsh on macOS.

```bash
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
```

```zsh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
```

```fish
echo '~/.local/bin/mise activate fish | source' >> ~/.config/fish/config.fish
```

Finally, run the following command to install the latest LTS version of Node.js:

```bash
mise use --global node@lts
```
