---
title: The setup
slug: the-setup
locale: en-US
order: 1
created: 2026-04-28 16:30:00.000Z
updated: 2026-04-28 16:30:00.000Z
---

There are multiple ways to install Node.js on whatever operating system you like. On this book, I'll use the [Mise](https://mise.jdx.dev/getting-started.html), as I think is the best tool for developers (and, it works on Linux, macOS and Windows). Mise enables you to manage multiple programming languages, environment variables, and tasks per project. This allows you to have multiple versions of the same programming language installed on your computer at the same time and choose the right version for each project.

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

Finally, verify the Node.js and NPM installations:

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

## The Node REPL

REPL stands for Read Evaluate Print Loop. It's an environment where you can input any expression valid for the programming language and see its results on the console after the execution. This enables you to quickly test simple code.

To start the <abbr title="Read Evaluate Print Loop">REPL</abbr>, open your terminal and type `node`. You will see this:

```
Welcome to Node.js v24.14.0.
Type ".help" for more information.
>
```

For example, type `Object.keys(global)` and hit <kbd>Enter</kbd> to see all the functions available globally on your environment. Don't forget to check the official [documentation](https://nodejs.org/learn/command-line/how-to-use-the-nodejs-repl) to learn more.

## Managing modules

Most modern languages have their own package manager to handle external modules. Node.js comes with NPM (Node Package Manager), but there are some other alternatives out there, like [Yarn](https://yarnpkg.com/) and [PNPM](https://pnpm.io/). Despite NPM being Node.js' default package manager, PNPM is faster, saves disk space and have some security configurations that are useful for any production-grade project. I'll get on more details about this on later chapters. The package manager serves to manage dependencies from the registry. The default registry is [NPM](https://www.npmjs.com/)(yes, it has the same name), but you there are others, like [JSR](https://jsr.io/), from the Deno folks and you can even setup a custom registry, if needed. So, let's install PNPM on our system:

```bash
npm install -g pnpm
```

Yes, we are using NPM to install PNPM globally on our system. There are other [ways](https://pnpm.io/installation) to install PNPM, but this is the most straightforward.

Here are the basic commands you need to know:

```
pnpm init # Start a new project on the current directory
pnpm add <package> # Install a module from the package registry (default from https://www.npmjs.com/)
pnpm remove <package> # Remove module from the current project
pnpm update <package> # Updates package to the latest version
```

When you init a new project or install any package, a `package.json` file will be created on the project's directory. Its purpose is to list project information, dependencies, tasks, license, and a few other things. Here is the [complete](https://docs.npmjs.com/cli/v11/configuring-npm/package-json) documentation, for reference.

Also, it's important to know that you can use NPM/PNPM/Yarn to publish your project to the world on the NPM registry. So, if you don't intend to publish your project to a public registry accidentally, add setup the `private` argument to `true` on your `package.json`:

```jsonc
{
  "private": "true"
}
```

Now, that you are grounded on the initial setup and has some idea on how to use Node.js package management tooling, let's start to prepare the initial setup of our project.