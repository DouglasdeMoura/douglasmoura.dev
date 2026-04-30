---
title: Installing Node.js
slug: installing-node-js
locale: en-US
order: 1
created: 2026-04-28 16:30:00.000Z
updated: 2026-04-28 16:30:00.000Z
---

## Installing in Windows

<!-- Mise can be installed on Windows too. Rewrite this section -->

Since Windows 10 version 1809 (build 17763), Windows users have access to [WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget/), a command line tool that enables the users to manage its applications through the command line. Therefore, to install Node.js on modern Windows machines, open PowerShell on administrator mode, by searching for **Windows PowerShell (Admin)** or **Terminal (Admin)**. List all the available versions by running:

```pwsh
winget search OpenJS.NodeJS
```

Install the latest LTS version:

```pwsh
winget install OpenJS.NodeJS.LTS
```

Restart your PowerShell and verify the installation: 

```pwsh
node --version
npm --version
```

You may see a message like `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system`. This happens because PowerShell [execution's policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.6) is blocking the execution of local unsigned scripts. To run scripts in Windows, the execution policy must be set, at minimum, to `RemoteSigned`. In order to do that, run that on PowerShell:

```pwsh
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

You can also install Node.js in your Windows machine through [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows Subsystem for Linux), to have all the power of Linux under your Windows machine. Follow the instructions on Microsoft's official documentation and then follow the same instructions to install Node.js on WSL from the next section.

## Installing on Linux and macOS

There is a miriad of options to install Node.js on Linux and on MacOS, but I'll show only the one I think it's best for developers: [Mise](https://mise.jdx.dev/). Mise is a tool that manage multiple programming languages, environment variables, and tasks per project. This allows you to have multiple versions of the same programming language installed on your computer at the same time and use the version you want separated per project.

So, to install Mise, open your terminal and run:

```bash
curl https://mise.run | sh
```

Checking the installation:

```bash
mise --version
```

Now, activate Mise for your shell (tip: run `echo $SHELL` to discover what is your default shell --- normally, it's Bash on Linux and ZSH on macOS):

```bash
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
```

```zsh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
```

```fish
echo '~/.local/bin/mise activate fish | source' >> ~/.config/fish/config.fish
```

And, finally, run the following command to install the latest LTS version of Node.js:

```bash
mise use --global node@lts
```

Mise can do a lot more things, I think it's worth to spend some time learning its capabilities on its [documentation](https://mise.jdx.dev/getting-started.html).
