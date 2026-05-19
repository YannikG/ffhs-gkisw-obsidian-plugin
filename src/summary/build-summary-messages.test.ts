import { describe, expect, it } from 'vitest';
import {
  SUMMARY_SYSTEM_PROMPT,
  buildSummaryMessages,
} from './build-summary-messages.js';

describe('buildSummaryMessages', () => {
  const sourceContext = '# Note\n\nContent about $x$ and $$y$$.';

  it('returns system then user messages with folder label and source corpus embedded', () => {
    const messages = buildSummaryMessages({
      folderLabel: 'GKISW',
      sourceContext,
    });

    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toBe(SUMMARY_SYSTEM_PROMPT);
    expect(messages[1]).toEqual({
      role: 'user',
      content: `## Folder\nGKISW\n\n## Source corpus\n${sourceContext}`,
    });
  });

  it('returns valid messages when folder label and source context are empty', () => {
    const messages = buildSummaryMessages({
      folderLabel: '',
      sourceContext: '',
    });

    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('system');
    expect(messages[1]).toEqual({
      role: 'user',
      content: '## Folder\n\n\n## Source corpus\n',
    });
  });
});

describe('SUMMARY_SYSTEM_PROMPT', () => {
  const prompt = SUMMARY_SYSTEM_PROMPT;

  it('includes Obsidian Markdown and math delimiter rules', () => {
    expect(prompt).toMatch(/Obsidian/i);
    expect(prompt).toMatch(/Markdown/i);
    expect(prompt).toContain('$');
    expect(prompt).toContain('$$');
  });

  it('includes Swiss German orthography guidance when output is German', () => {
    expect(prompt).toMatch(/Swiss/i);
    expect(prompt).toMatch(/\bss\b/i);
    expect(prompt).toMatch(/umlaut/i);
  });

  it('matches output language to the dominant language of the source corpus', () => {
    expect(prompt).toMatch(/dominant language/i);
    expect(prompt).toMatch(/source corpus/i);
  });

  it('requires source fidelity, preserving apparent errors, and concise output', () => {
    expect(prompt).toMatch(/do not correct/i);
    expect(prompt).toMatch(/apparent errors/i);
    expect(prompt).toMatch(/concise|key points/i);
  });

  it('forbids mandatory H1, allows optional frontmatter, and restricts links', () => {
    expect(prompt).toMatch(/H1|top-level/i);
    expect(prompt).toMatch(/frontmatter/i);
    expect(prompt).toMatch(/wikilink/i);
    expect(prompt).toMatch(/external URLs/i);
  });
});
