import { describe, expect, it } from 'vitest';
import {
  CREATE_SUMMARY_MENU_LABEL,
  CREATE_SUMMARY_STUB_NOTICE,
} from './create-summary-stub.js';

describe('create-summary-stub constants', () => {
  it('uses SPEC display name for the menu label', () => {
    expect(CREATE_SUMMARY_MENU_LABEL).toBe('Create Summary');
  });

  it('uses a clear stub notice message', () => {
    expect(CREATE_SUMMARY_STUB_NOTICE).toContain('Stub');
    expect(CREATE_SUMMARY_STUB_NOTICE).toContain('Create Summary');
  });
});
