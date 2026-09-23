# ccstatusline mod

A Claude Code plugin whose hooks module draws the ccstatusline settings under the prompt.

| Widget | Source |
| --- | --- |
| `model` | the model that answered the last turn |
| `context-length`, `context-percentage`, `context-bar` | `$.session.usage()` |
| `output-speed` | output tokens over the time from each response's first streamed chunk to its end |
| `session-cost` | `$.session.usage().cost` |
| `cache-timer` | time since the last turn ended, against the 5-minute TTL |
| `cache-hit-rate`, `cache-read`, `cache-write` | the last turn's token counts |
| `git-worktree`, `git-branch`, `git-changes` | git, rerun after each turn and each Bash or edit tool call |
| `custom-text`, `custom-command` | as in ccstatusline; a command reruns every 30 seconds |
| `cache-miss-reason` | why the last turn's first request rewrote the cache |
| `project-cost-today` | what this project (its git root) has cost today, across sessions |

Every other widget type draws nothing.

## Limits

- It draws under the prompt, below Claude Code's permission-mode row; mods cannot draw into the status line row.
- The cache timer assumes the 5-minute TTL and reads in whole minutes: on 2.1.280 each redraw of that row flashes one frame, so it redraws only when its text changes.
- Cost is Claude Code's estimate, the `/cost` figure; on a subscription it is the API-price equivalent.
- The ledger records turns from when the mod is installed.

## Develop

```
bun run mod:typecheck   # needs mod/types/claude-code.d.ts: run /plugin-types in Claude Code and copy it there
bun run mod:test        # claude plugin test mod
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir mod
```
