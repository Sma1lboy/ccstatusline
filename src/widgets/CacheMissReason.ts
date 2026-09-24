import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';
import { formatTokens } from '../utils/format-tokens';
import { readModSnapshot } from '../utils/mod-snapshot';

import { formatRawOrLabeledValue } from './shared/raw-or-labeled';

// The Claude Code mod (mod/) sees each request's cache usage and the gap before
// it and writes the verdict to a per-session snapshot; without the mod this draws nothing.
export class CacheMissReasonWidget implements Widget {
    getDefaultColor(): string { return 'yellow'; }
    getDescription(): string { return 'Why the last turn rewrote the prompt cache (idle past the TTL, model switch, compaction). Needs the Claude Code mod'; }
    getDisplayName(): string { return 'Cache Miss Reason'; }
    getCategory(): string { return 'Cache'; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName(), modifierText: '(needs mod)' };
    }

    render(item: WidgetItem, context: RenderContext, _settings: Settings): string | null {
        if (context.isPreview) {
            return formatRawOrLabeledValue(item, 'Miss: ', 'idle 7m > 5m ttl, +181.0k rewritten');
        }
        const miss = readModSnapshot(context)?.miss;
        return miss ? formatRawOrLabeledValue(item, 'Miss: ', `${miss.reason}, +${formatTokens(miss.written)} rewritten`) : null;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
