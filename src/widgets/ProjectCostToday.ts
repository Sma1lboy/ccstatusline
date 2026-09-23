import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

import { formatRawOrLabeledValue } from './shared/raw-or-labeled';

// Drawn by the Claude Code mod (mod/), which keeps a ledger across sessions.
// The status line command sees one session at a time, so it draws nothing.
export class ProjectCostTodayWidget implements Widget {
    getDefaultColor(): string { return 'green'; }
    getDescription(): string { return 'What this project (its git root) has cost today, across every session. Mod only'; }
    getDisplayName(): string { return 'Project Cost Today'; }
    getCategory(): string { return 'Session'; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName(), modifierText: '(mod only)' };
    }

    render(item: WidgetItem, context: RenderContext, _settings: Settings): string | null {
        if (context.isPreview) {
            return formatRawOrLabeledValue(item, 'Today: ', '$4.12');
        }
        return null;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
