/** User-visible notices for Create Summary (P5-I06, P7-I04). */

import type { OllamaError } from '../ollama/types.js';

const OLLAMA_CONNECTION_NOTICE = 'Ollama ist nicht erreichbar.';
const OLLAMA_TIMEOUT_NOTICE = 'Ollama-Anfrage hat das Zeitlimit überschritten.';

export function mapOllamaErrorToNotice(error: OllamaError): string {
  if (error.kind === 'connection') return OLLAMA_CONNECTION_NOTICE;
  if (error.kind === 'timeout') return OLLAMA_TIMEOUT_NOTICE;
  return createSummaryOllamaErrorNotice(error.message);
}

export const CREATE_SUMMARY_RUN_ALREADY_NOTICE = 'Läuft bereits';
export const CREATE_SUMMARY_GENERATING_NOTICE = 'Generiere…';
export const CREATE_SUMMARY_CONTEXT_LIMIT_NOTICE = 'Kontextlimit überschritten.';
export const CREATE_SUMMARY_NO_SOURCES_NOTICE = 'Keine Quellen in diesem Ordner.';
export const CREATE_SUMMARY_EMPTY_RETRIEVAL_NOTICE =
  'Keine indexierten Inhalte für die Zusammenfassung.';

export function createSummarySuccessNotice(filename: string): string {
  return `Summary erstellt: ${filename}`;
}

export function overwriteSummarySuccessNotice(filename: string): string {
  return `Summary überschrieben: ${filename}`;
}

export function createSummaryOllamaErrorNotice(message: string): string {
  return message;
}
