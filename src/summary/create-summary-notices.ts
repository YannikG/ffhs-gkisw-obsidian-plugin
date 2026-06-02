/** User-visible notices for Create Summary (P5-I06, P7-I04). */

export const CREATE_SUMMARY_RUN_ALREADY_NOTICE = 'Läuft bereits';
export const CREATE_SUMMARY_GENERATING_NOTICE = 'Generiere…';
export const CREATE_SUMMARY_EMPTY_FOLDER_NOTICE = 'Keine Markdown-Quellen in diesem Ordner.';
export const CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE = 'Kontextlimit überschritten.';
export const CREATE_SUMMARY_NO_SOURCES_NOTICE = 'Keine Quellen in diesem Ordner.';
export const CREATE_SUMMARY_EMPTY_RETRIEVAL_NOTICE =
  'Keine indexierten Inhalte für die Zusammenfassung.';

export function createSummarySuccessNotice(filename: string): string {
  return `Summary erstellt: ${filename}`;
}

export function createSummaryOllamaErrorNotice(message: string): string {
  return message;
}
