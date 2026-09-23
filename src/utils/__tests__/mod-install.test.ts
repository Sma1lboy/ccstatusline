import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
    describe,
    expect,
    it
} from 'vitest';

import {
    ALIAS_LINE,
    addHooksAlias,
    getShellRcPath
} from '../mod-install';
import {
    getPackageVersion,
    getUpstreamVersion
} from '../terminal';

describe('mod install', () => {
    it('picks the rc file of the login shell', () => {
        expect(getShellRcPath('/bin/zsh', '/h')).toBe('/h/.zshrc');
        expect(getShellRcPath('/usr/local/bin/bash', '/h')).toBe('/h/.bashrc');
        expect(getShellRcPath('/opt/homebrew/bin/fish', '/h')).toBe('/h/.config/fish/config.fish');
        expect(getShellRcPath('', '/h')).toBe('/h/.zshrc');
    });

    it('appends the alias once and keeps what the rc file had', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ccsl-mod-'));
        const rc = path.join(dir, '.zshrc');
        fs.writeFileSync(rc, 'export PATH=/x:$PATH');

        expect(addHooksAlias(rc)).toBe(true);
        expect(addHooksAlias(rc)).toBe(false);

        const text = fs.readFileSync(rc, 'utf8');
        expect(text.startsWith('export PATH=/x:$PATH\n')).toBe(true);
        expect(text.split(ALIAS_LINE)).toHaveLength(2);
        fs.rmSync(dir, { recursive: true });
    });
});

describe('fork version', () => {
    it('installs of the upstream status line command use a version upstream publishes', () => {
        expect(getPackageVersion()).toMatch(/-mod\.\d+$/);
        expect(getUpstreamVersion()).toMatch(/^\d+\.\d+\.\d+$/);
    });
});
