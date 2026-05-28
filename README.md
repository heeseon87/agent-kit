# claude-kit

Tokyo Night powerline statusline + essential skills for Claude Code. Works on macOS, Linux, and Windows.

This repository also ships a Codex-friendly companion plugin, `agent-kit`, for
the workflow skills that are not Claude Code specific.

## Prerequisites

[Node.js](https://nodejs.org/) 18 or newer in PATH. On Windows the standard installer (`C:\Program Files\nodejs`) is recommended; nvm-windows / fnm / volta also work.

## Install (one-time)

### Claude Code

```
/plugin marketplace add heeseon87/agent-kit
/plugin install claude-kit@hs
/claude-kit:setup
```

Then restart Claude Code once. The statusline appears at the bottom of the screen.

### Codex

Add this repository as a Codex plugin marketplace:

```bash
codex plugin marketplace add heeseon87/agent-kit
```

Then open Codex Plugins, search for `Agent Kit`, and install it.

The Codex plugin intentionally excludes the Claude Code HUD/statusline setup.
It includes only the portable workflow skills: edit, explain, implement,
interview, and pretty.

## Update

```
/plugin marketplace update hs
/plugin update claude-kit@hs
```

That's it — **no manual setup re-run is needed**. A `SessionStart` hook installed by the initial setup automatically syncs HUD files with the latest plugin version every time you start a session.

## Platform notes

On Windows, setup points `statusLine.command` directly at `node statusline.mjs` instead of generating a `statusline.cmd` wrapper. This still avoids relying on PATHEXT/shebang execution, but removes the extra batch-file layer that could leave orphaned `cmd.exe` processes after Claude Code was hard-killed. The command prefers `%ProgramFiles%\nodejs\node.exe` and falls back to the node binary that ran setup. If you switch node installations, re-run `/claude-kit:setup` once to refresh the node reference.

## Troubleshooting

```
/claude-kit:doctor
```

Checks node availability, HUD file presence, settings.json configuration, the SessionStart hook, and stale Windows node references / legacy `.cmd` wrapper configuration — auto-fixes anything fixable.

## Nerd Font Setup

Statusline icons require a [Nerd Font](https://github.com/ryanoasis/nerd-fonts/releases). We recommend JetBrainsMono Nerd Font.

### macOS

```bash
brew install --cask font-jetbrains-mono-nerd-font
```

Then set your terminal font to `JetBrainsMono Nerd Font`.

### Windows

```powershell
winget install JanDeDobbeleer.OhMyPosh --source winget
oh-my-posh font install
```

Choose `JetBrainsMono`, then in Windows Terminal: Settings > [Your Profile] > Appearance > Font face > `JetBrainsMono Nerd Font`.

### Linux

```bash
mkdir -p ~/.local/share/fonts
cd ~/.local/share/fonts
curl -fLO https://github.com/ryanoasis/nerd-fonts/releases/latest/download/JetBrainsMono.zip
unzip JetBrainsMono.zip -d JetBrainsMono
fc-cache -fv
```

Then set your terminal font to `JetBrainsMono Nerd Font`.

> If you're using WSL, install the font on Windows and configure it in Windows Terminal instead of inside WSL.
