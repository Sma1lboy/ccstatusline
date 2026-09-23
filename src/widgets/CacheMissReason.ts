import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

import { formatRawOrLabeledValue } from './shared/raw-or-labeled';

// Drawn by the Claude Code mod (mod/), which sees each request's cache usage
// and the gap before it. The status line command has neither, so it draws nothing.
export class CacheMissReasonWidget implements Widget {
    getDefaultColor(): string { return 'yellow'; }
    getDescription(): string { return 'Why the last turn rewrote the prompt cache (idle past the TTL, model switch, compaction). Mod only'; }
    getDisplayName(): string { return 'Cache Miss Reason'; }
    getCategory(): string { return 'Cache'; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName(), modifierText: '(mod only)' };
    }

    render(item: WidgetItem, context: RenderContext, _settings: Settings): string | null {
        if (context.isPreview) {
            return formatRawOrLabeledValue(item, 'Miss: ', 'idle 7m > 5m ttl, +181.0k rewritten');
        }
        return null;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
