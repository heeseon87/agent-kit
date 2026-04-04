---
name: claude-kit:setup
description: Initial setup for Tokyo Night statusline (for troubleshooting, use /claude-kit:doctor instead)
---

# Claude Kit Setup

Run the setup script to configure the Tokyo Night powerline statusline.
For troubleshooting existing installations, use `/claude-kit:doctor` instead.

## Steps

1. Find the plugin cache directory and run the setup script:

```bash
node -e "var path=require('path'),fs=require('fs'),root=path.join(require('os').homedir(),'.claude/plugins/cache');function walk(dir){for(var e of fs.readdirSync(dir,{withFileTypes:true})){var full=path.join(dir,e.name);if(e.isDirectory())walk(full);else if(e.name=='plugin-setup.mjs'&&full.includes('claude-kit')){require('child_process').execFileSync(process.execPath,[full],{stdio:'inherit'});process.exit(0)}}}walk(root)"
```

2. After setup completes, tell the user to restart Claude Code to see the new statusline.

## What it does

- Backs up existing HUD files to `~/.claude/hud/backup/`
- Copies `statusline.mjs` to `~/.claude/hud/`
- Configures `settings.json` with the statusline command
- Uses shebang-based execution (`#!/usr/bin/env node`) — works with any node version manager (nvm/fnm/volta)

## After setup

The statusline shows:
- Line 1: Version | Model(Context) | Directory | Branch (powerline segments)
- Line 2: 5h/7d rate limits with progress bars | Session duration | Context bar

Skills available: `/interview`, `/edit`, `/explain`
