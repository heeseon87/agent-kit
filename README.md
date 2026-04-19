# claude-kit

## Install

```
/plugin marketplace add heeseon87/claude-kit
/plugin install claude-kit@hs
```

Restart Claude Code, then:

```
/claude-kit:setup
```

## Platform support

Works on macOS, Linux, and Windows. On Windows, setup also generates `~/.claude/hud/statusline.cmd` — a thin wrapper that invokes node with the `.mjs` (since Windows can't execute `.mjs` directly via PATHEXT/shebang). The wrapper prefers `%ProgramFiles%\nodejs\node.exe` and falls back to the node binary that ran setup.

**Re-run `/claude-kit:setup` after:**
- Switching node installations (uninstalling/reinstalling, changing version managers)
- Updating the plugin to a new version

## Troubleshooting

If the statusline stops working (e.g. after switching node version managers, or on Windows after a node path change):

```
/claude-kit:doctor
```

This checks node availability, file permissions, settings.json configuration, and the `.cmd` wrapper on Windows, then auto-fixes any issues found.

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
