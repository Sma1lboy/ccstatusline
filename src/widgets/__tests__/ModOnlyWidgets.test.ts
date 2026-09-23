import {
    describe,
    expect,
    it
} from 'vitest';

import { DEFAULT_SETTINGS } from '../../types/Settings';
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
