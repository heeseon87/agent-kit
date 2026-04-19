---
name: claude-kit:setup
description: Initial setup for Tokyo Night statusline (for troubleshooting, use /claude-kit:doctor instead)
---

# Claude Kit Setup

Run the setup script to configure the Tokyo Night powerline statusline.
For troubleshooting existing installations, use `/claude-kit:doctor` instead.

## Steps

1. Find the **latest** cached plugin-setup.mjs (SemVer descending) and run it. Picking the highest version is critical: stale older versions in the cache (e.g. 1.2.0) lack the Windows symlink-fallback and will crash on Windows.

```bash
node -e "var p=require('path'),fs=require('fs'),h=require('os').homedir(),c=p.join(h,'.claude/plugins/cache'),r=[];function w(d){try{for(var e of fs.readdirSync(d,{withFileTypes:true})){var f=p.join(d,e.name);if(e.isDirectory())w(f);else if(e.name=='plugin-setup.mjs'&&f.includes('claude-kit')){var v=p.basename(p.dirname(p.dirname(f)));if(/^[0-9]+\.[0-9]+\.[0-9]+$/.test(v))r.push([v,f])}}}catch(_){}}w(c);if(!r.length){console.error('plugin-setup.mjs not found in cache');process.exit(1)}r.sort(function(a,b){var x=a[0].split('.').map(Number),y=b[0].split('.').map(Number);for(var i=0;i<3;i++)if(x[i]!==y[i])return y[i]-x[i];return 0});require('child_process').execFileSync(process.execPath,[r[0][1]],{stdio:'inherit'})"
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
