import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import type { RenderContext } from '../types/RenderContext';

/** What the Claude Code mod (mod/) writes per session for the status line command to draw. */
export interface ModSnapshot {
    miss: { reason: string; written: number } | null;
    todayUsd: number | null;
    outputTps: number | null;
    cacheEndsAt: number | null;
    working: boolean;
}

export function getModSnapshotPath(sessionId: string, home = os.homedir()): string {
    return path.join(home, '.cache', 'ccstatusline', 'mod', `${sessionId}.json`);
}

/** The mod's snapshot for this render's session; null without the mod or a session id. */
export function readModSnapshot(context: RenderContext, home?: string): ModSnapshot | null {
    const sessionId = context.data?.session_id;
    if (!sessionId || !/^[\w-]+$/.test(sessionId)) {
        return null;
    }
    try {
        const parsed = JSON.parse(fs.readFileSync(getModSnapshotPath(sessionId, home), 'utf8')) as Partial<ModSnapshot> & { v?: number };
        if (parsed.v !== 1) {
            return null;
        }
        return {
            miss: parsed.miss ?? null,
            todayUsd: parsed.todayUsd ?? null,
            outputTps: parsed.outputTps ?? null,
            cacheEndsAt: parsed.cacheEndsAt ?? null,
            working: parsed.working === true
        };
    } catch {
        return null;
    }
}
