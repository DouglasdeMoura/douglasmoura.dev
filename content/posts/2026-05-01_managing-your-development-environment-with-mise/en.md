---
title: "Managing your development environment with Mise (and understanding shims!)"
slug: managing-your-development-environment-with-mise
locale: en-US
created: 2026-05-01 12:13:37.281Z
updated: 2026-05-01 19:12:04.000Z
cover: ./cover.png
tags:
  - Development Tools
  - Environment
  - Languages
---

I have run into this scenario a lot: we start a new project with the latest version of a programming language, but still need to maintain a legacy application that uses an older version of the same language. Sometimes I am working on a project that uses the <abbr title="Long Term Support">LTS</abbr> version, but I want to experiment with the latest nightly release on the side. Pretty much every language has some kind of tool to handle this, like [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), [n](https://github.com/mklement0/n-install), or [volta](https://volta.sh/) for Node.js, [pyenv](https://github.com/pyenv/pyenv) for Python, [rbenv](https://github.com/rbenv/rbenv) for Ruby, [goenv](https://github.com/go-nv/goenv) for Go, and so on. There are also polyglot solutions, which work for several languages, like [ASDF](https://asdf-vm.com/) and my favorite one, [Mise](https://mise.jdx.dev/).

## The tool

Mise is a solo project by Jeff Dickey, a Dallas-based developer who maintains a bunch of open-source tools (check his [website](https://jdx.dev/) to see what he is up to). Besides managing programming language versions, Mise can set up environment variables and run project-specific tasks with the configured tool versions. You are not bound to its conventions, either: if you want to keep using the version file your project already has, like `.nvmrc` or `.node-version` for Node.js, Mise will respect it.

## The inner workings

In simple terms, Mise installs the binaries for the selected programming language and shims your calls to that language.

<aside data-alert data-color="blue" role="note">
<strong>What is a shim?</strong>
A shim is a small compatibility layer that intercepts a call, handles it directly, or redirects it somewhere else. You can think of it as a proxy.
</aside>

To get a glimpse of how this works, let's implement a very basic shim to manage Node.js.

### Linux and Bash

First, download Node.js' standalone binaries [here](https://nodejs.org/en/download/). Use the `.tar.xz` archives. Extract them and move the extracted directories to `~/.nodejs`. This directory should now look something like this:

```bash
node-v24.15.0-linux-x64
node-v25.9.0-linux-x64
```

This Bash example also works on macOS. The only meaningful difference is the platform suffix in the extracted Node.js directory and in the `binary_path` line: use `darwin-arm64` on Apple Silicon Macs or `darwin-x64` on Intel Macs. For example:

```bash
binary_path="$dir/node-v$version-darwin-arm64/bin/node"
```

Now, let's create a directory for our tests: `mkdir ~/shim-example`. Then, let's add a file that tells the shim which version of Node.js we want to use in that directory. Run:

```bash
echo "24.15.0" > ~/shim-example/.node-version
```

Finally, let's create the Bash script that will select the Node.js version we want:

```bash
#!/usr/bin/env bash

# Makes the script exit when: a command fails (-e), a variable is unset (-u), any command in a pipeline fails (-o pipefail)
set -euo pipefail

# Set the directory where you will save all the Node.js binaries you want
dir="$HOME/.nodejs"

if [ ! -f .node-version ]; then
  echo "No Node.js version defined. Please create a .node-version file and write the desired version."
  exit 1
fi

# Read the .node-version file to select the desired Node.js version
version=$(cat .node-version)

if [ -z "$version" ]; then
  echo "No Node.js version defined. Please write the desired version in .node-version."
  exit 1
fi

binary_path="$dir/node-v$version-linux-x64/bin/node"

if [ ! -f "$binary_path" ]; then
  echo "Node.js $version is not installed at $dir. Go to https://nodejs.org/en/download, download a standalone binary, and extract it into $dir."
  exit 1
fi

exec "$binary_path" "$@"
```

Save this Bash script as `node`, then move it to `~/.local/bin` and make it executable:

```bash
mkdir -p ~/.local/bin
mv node ~/.local/bin/node
chmod +x ~/.local/bin/node
```

This directory will probably already be on your `$PATH`. You can check with:

```bash
printf '%s\n' "$PATH" | tr ':' '\n' | grep -Fx "$HOME/.local/bin"
```

If nothing is returned, you should add this directory to your `$PATH`. Make sure it appears before any other directory that contains a `node` executable. To check if everything went well, run `command -v node`. You should see the following output:

```bash
$ command -v node
/home/your-username/.local/bin/node
```

Now, run `node --version` inside the `~/shim-example` directory. You should see `v24.15.0`. Change the version in `.node-version` to 25.9.0 (`echo "25.9.0" > .node-version`) and run `node --version` again. You should see the new Node.js version activated in that directory.

### Windows and PowerShell

On Windows, download the `.zip` standalone binaries from the same Node.js download page. Extract them into `$HOME\.nodejs`. That directory should look something like this:

```powershell
node-v24.15.0-win-x64
node-v25.9.0-win-x64
```

Create the test directory and `.node-version` file:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\shim-example"
Set-Content -Path "$HOME\shim-example\.node-version" -Value "24.15.0"
```

Then create this PowerShell shim:

```powershell
$ErrorActionPreference = "Stop"

$versionsDir = Join-Path $HOME ".nodejs"
$versionFile = Join-Path (Get-Location) ".node-version"

if (-not (Test-Path -LiteralPath $versionFile -PathType Leaf)) {
  Write-Error "No Node.js version defined. Please create a .node-version file and write the desired version."
  exit 1
}

$version = (Get-Content -LiteralPath $versionFile -Raw).Trim()

if ([string]::IsNullOrWhiteSpace($version)) {
  Write-Error "No Node.js version defined. Please write the desired version in .node-version."
  exit 1
}

$versionDir = Join-Path $versionsDir "node-v$version-win-x64"
$binaryPath = Join-Path $versionDir "node.exe"

if (-not (Test-Path -LiteralPath $binaryPath -PathType Leaf)) {
  Write-Error "Node.js $version is not installed at $versionsDir. Go to https://nodejs.org/en/download, download a standalone binary, and extract it into $versionsDir."
  exit 1
}

& $binaryPath @args
exit $LASTEXITCODE
```

Save it as `node.ps1` in a directory that is on your PowerShell path. For example:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\bin"
Move-Item -Path .\node.ps1 -Destination "$HOME\bin\node.ps1" -Force
```

If `$HOME\bin` is not on your path yet, add it for your user. Put it before the existing path so this shim wins over any other Node.js installation:

```powershell
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$HOME\bin;$userPath", "User")
```

Open a new PowerShell session so it picks up the updated path. Then check that PowerShell finds the shim:

```powershell
Get-Command node
```

Finally, run `node --version` inside `$HOME\shim-example`. You should see `v24.15.0`. Change the version in `.node-version` to 25.9.0 (`Set-Content -Path .\.node-version -Value "25.9.0"`) and run `node --version` again.

Mise does all of this, and a little more, using Rust. This example should still give you a pretty good idea of how it works.

## Installing and configuring Mise

There is a myriad of ways to install Mise, so I recommend going directly to its [documentation](https://mise.jdx.dev/getting-started.html). After installing and configuring Mise, install the tools you [need](https://mise.jdx.dev/core-tools.html). Personally, I do not use the Mise configuration file (`mise.toml`) in the Node.js projects I work on, because some people on the team use different tooling. Instead, I add the Node.js version to `.node-version`, which is supported by a large number of similar tools.
