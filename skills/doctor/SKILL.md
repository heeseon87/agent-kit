---
name: claude-kit:doctor
description: Diagnose and fix claude-kit statusline issues (broken paths, permissions, outdated settings)
---

# Claude Kit Doctor

Diagnose and automatically fix common statusline issues.

## Steps

Run these checks **in order**. Print each result as a checklist. If any check fails, fix it and re-verify.

### 1. Check node availability

```bash
which node && node --version
```

- Pass: node found in PATH
- Fail: Tell user to install Node.js or configure their version manager

### 2. Check statusline.mjs exists

```bash
test -f ~/.claude/hud/statusline.mjs && echo "OK" || echo "MISSING"
```

- Pass: File exists
- Fail: Run the setup script to reinstall (see Step 5)

### 3. Check statusline.mjs is executable

```bash
test -x ~/.claude/hud/statusline.mjs && echo "OK" || echo "NOT_EXECUTABLE"
```

- Pass: File is executable
- Fix: `chmod 755 ~/.claude/hud/statusline.mjs`

### 4. Check settings.json statusLine command

```bash
cat ~/.claude/settings.json
```

Inspect `statusLine.command` value. Look for these problems:

| Problem | Pattern | Fix |
|---------|---------|-----|
| Hardcoded node path | `"/path/to/node" "/path/to/statusline.mjs"` | Remove node path, keep only script path |
| Missing statusLine | No `statusLine` key | Run setup script |
| Wrong script path | Path doesn't end with `statusline.mjs` | Run setup script |

**The correct format is:**
```json
{
  "statusLine": {
    "type": "command",
    "command": "\"<homedir>/.claude/hud/statusline.mjs\""
  }
}
```

If the command contains a node binary path (e.g. `.nvm/versions/`, `.fnm/`, `.volta/`), fix it by editing settings.json to remove the node path prefix — keep only the `"<script_path>"` part.

### 5. Reinstall (if files are missing)

Only run this if Step 2 failed (statusline.mjs missing):

```bash
node -e "var path=require('path'),fs=require('fs'),root=path.join(require('os').homedir(),'.claude/plugins/cache');function walk(dir){for(var e of fs.readdirSync(dir,{withFileTypes:true})){var full=path.join(dir,e.name);if(e.isDirectory())walk(full);else if(e.name=='plugin-setup.mjs'&&full.includes('claude-kit')){require('child_process').execFileSync(process.execPath,[full],{stdio:'inherit'});process.exit(0)}}}walk(root)"
```

### 6. Verify fix

After any fix, run the statusline to confirm it works:

```bash
~/.claude/hud/statusline.mjs
```

- Pass: Outputs statusline text (may contain special characters — that's normal)
- Fail: Show error to user

## Output format

```
claude-kit doctor
  [pass] node available (v22.x.x)
  [pass] statusline.mjs exists
  [pass] statusline.mjs is executable
  [FAIL] settings.json has hardcoded node path → fixed
  [pass] statusline runs successfully

All checks passed. Restart Claude Code to apply changes.
```

Use `[pass]` and `[FAIL]` prefixes. If any fix was applied, remind the user to restart Claude Code.
