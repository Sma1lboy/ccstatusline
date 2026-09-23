import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import {
    loadClaudeSettings,
    saveClaudeSettings
} from './claude-settings';

// Installs mod/ as a Claude Code plugin from this repository's marketplace.
export const MOD_MARKETPLACE = 'Sma1lboy/ccstatusline';
export const MOD_MARKETPLACE_NAME = 'ccstatusline';
export const MOD_PLUGIN = `ccstatusline@${MOD_MARKETPLACE_NAME}`;
export const HOOKS_ENV = 'CLAUDE_CODE_ENABLE_FUNCTION_HOOKS';

/** How Claude Code gets function hooks switched on; mods load only with it. */
export type ModHooksMethod = 'alias' | 'settings' | 'none';

const ALIAS_MARKER = '# ccstatusline mod: Claude Code loads mods only with function hooks on';

export const ALIAS_LINE = `alias claude='${HOOKS_ENV}=1 claude'`;

/** The rc file of the user's login shell: ~/.zshrc, ~/.bashrc, or fish's config.fish. */
export function getShellRcPath(shell = process.env.SHELL ?? '', home = os.homedir()): string {
    const name = path.basename(shell);
    if (name === 'fish') {
        return path.join(home, '.config', 'fish', 'config.fish');
    }
    if (name === 'bash') {
        return path.join(home, '.bashrc');
    }
    return path.join(home, '.zshrc');
}

/** Appends the alias to the rc file once; false when it was already there. */
export function addHooksAlias(rcPath: string): boolean {
    const existing = fs.existsSync(rcPath) ? fs.readFileSync(rcPath, 'utf8') : '';
    if (existing.includes(ALIAS_LINE)) {
        return false;
    }
    fs.mkdirSync(path.dirname(rcPath), { recursive: true });
    const lead = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
    fs.appendFileSync(rcPath, `${lead}\n${ALIAS_MARKER}\n${ALIAS_LINE}\n`);
    return true;
}

/** Sets the variable in Claude Code's settings.json `env`, which every session reads. */
export async function enableHooksInClaudeSettings(): Promise<void> {
    const settings = await loadClaudeSettings();
    const env = (settings.env ?? {}) as Record<string, string>;
    await saveClaudeSettings({ ...settings, env: { ...env, [HOOKS_ENV]: '1' } });
}

/** The commands the install runs, in order, as shown to the user before it runs them. */
export function getModInstallCommands(): string[][] {
    return [
        ['claude', 'plugin', 'marketplace', 'add', MOD_MARKETPLACE],
        // add and install leave an existing marketplace or plugin as it was; these bring it to the latest
        ['claude', 'plugin', 'marketplace', 'update', MOD_MARKETPLACE_NAME],
        ['claude', 'plugin', 'install', MOD_PLUGIN],
        ['claude', 'plugin', 'update', MOD_PLUGIN]
    ];
}

function run(argv: string[]): { ok: boolean; output: string } {
    try {
        const output = execFileSync(argv[0] ?? '', argv.slice(1), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return { ok: true, output };
    } catch (error) {
        const e = error as { stdout?: string; stderr?: string; message?: string };
        return { ok: false, output: `${e.stdout ?? ''}${e.stderr ?? e.message ?? ''}` };
    }
}

/**
 * Adds the marketplace and installs the plugin. A marketplace or plugin that is
 * already there is not a failure; the plugin list is the check.
 */
export function installModPlugin(): void {
    for (const argv of getModInstallCommands()) {
        run(argv);
    }
    const listed = run(['claude', 'plugin', 'list']);
    if (!listed.output.includes(MOD_PLUGIN)) {
        throw new Error(`${MOD_PLUGIN} is not in \`claude plugin list\`:\n${listed.output}`);
    }
}
