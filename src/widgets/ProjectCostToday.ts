import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';
import { readModSnapshot } from '../utils/mod-snapshot';

import { formatRawOrLabeledValue } from './shared/raw-or-labeled';

// The Claude Code mod (mod/) keeps a ledger across sessions and writes today's
// total to a per-session snapshot; without the mod this draws nothing.
export class ProjectCostTodayWidget implements Widget {
    getDefaultColor(): string { return 'green'; }
    getDescription(): string { return 'What this project (its git root) has cost today, across every session. Needs the Claude Code mod'; }
    getDisplayName(): string { return 'Project Cost Today'; }
    getCategory(): string { return 'Session'; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName(), modifierText: '(needs mod)' };
    }

    render(item: WidgetItem, context: RenderContext, _settings: Settings): string | null {
        if (context.isPreview) {
            return formatRawOrLabeledValue(item, 'Today: ', '$4.12');
        }
        const usd = readModSnapshot(context)?.todayUsd;
        return usd === null || usd === undefined ? null : formatRawOrLabeledValue(item, 'Today: ', `$${usd.toFixed(2)}`);
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
