import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
    describe,
    expect,
    it
} from 'vitest';

import { DEFAULT_SETTINGS } from '../../types/Settings';
import {
    getModSnapshotPath,
    readModSnapshot
} from '../../utils/mod-snapshot';
import { getWidget } from '../../utils/widgets';

describe('mod-only widgets', () => {
    for (const type of ['cache-miss-reason', 'project-cost-today']) {
        it(`${type} is registered, previews a sample and draws nothing in the status line command`, () => {
            const widget = getWidget(type);
            expect(widget).not.toBeNull();
            expect(widget?.render({ id: type, type }, { isPreview: true }, DEFAULT_SETTINGS)).toBeTruthy();
            expect(widget?.render({ id: type, type }, {}, DEFAULT_SETTINGS)).toBeNull();
        });
    }
});

describe('mod snapshot', () => {
    it('draws the miss reason and today\'s cost the mod wrote for this session', () => {
        const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ccsl-snap-'));
        const file = getModSnapshotPath('abc-123', home);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify({ v: 1, miss: { reason: 'idle 7m > 5m ttl', written: 181000 }, todayUsd: 4.5, outputTps: 90, cacheEndsAt: null, working: false }));
        const snapshot = readModSnapshot({ data: { session_id: 'abc-123' } }, home);
        expect(snapshot?.miss?.reason).toBe('idle 7m > 5m ttl');
        expect(snapshot?.todayUsd).toBe(4.5);
        expect(readModSnapshot({ data: { session_id: 'other' } }, home)).toBeNull();
        expect(readModSnapshot({ data: { session_id: '../../etc' } }, home)).toBeNull();
        fs.rmSync(home, { recursive: true });
    });
});
