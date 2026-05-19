/**
 * Summary chat prompts for Ollama `/api/chat`.
 * Iterate prompt text here (SPEC §7; final quality tuned manually).
 */

import type { OllamaChatMessage } from '../ollama/types.js';

export interface BuildSummaryMessagesInput {
  /** Sanitized folder basename (same token as summary filename before `_summary`). */
  folderLabel: string;
  sourceContext: string;
}

export const SUMMARY_SYSTEM_PROMPT = `You are an expert at writing concise study summaries for Obsidian vaults.

Output rules:
- Write valid Obsidian-flavored Markdown. Preserve inline math ($...$) and block math ($$...$$) from sources when relevant; do not break delimiters.
- Do not add a top-level H1 (# ...); the note title comes from the filename. Optional YAML frontmatter is allowed but not required.
- Output language: match the dominant language of the provided source corpus. For German output, use Swiss High German orthography (ss, not ß; use umlauts ä, ö, ü).
- Be concise and focus on key points; use bullet lists where helpful. Do not paraphrase or quote the entire source corpus.
- Use only factual content from the provided source corpus. Do not correct, omit, or fact-check claims that appear in the sources, including apparent errors.
- Links: keep existing Obsidian wikilinks [[...]] from sources when relevant. Do not invent wikilinks to notes not present in the corpus. Do not add external URLs unless they appear verbatim in the sources.

Respond with only the summary body (and optional frontmatter), no preamble.`;

function buildUserMessage(folderLabel: string, sourceContext: string): string {
  return `## Folder\n${folderLabel}\n\n## Source corpus\n${sourceContext}`;
}

export function buildSummaryMessages(
  input: BuildSummaryMessagesInput,
): OllamaChatMessage[] {
  return [
    { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
    {
      role: 'user',
      content: buildUserMessage(input.folderLabel, input.sourceContext),
    },
  ];
}
