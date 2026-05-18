export const PLUGIN_ID = 'ffhs-gkisw-obsidian-plugin' as const;

/** Display name in Obsidian plugin list and settings tab. */
export const PLUGIN_DISPLAY_NAME = 'Obsidian Summarizer' as const;

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
  minAppVersion: string;
};

const REQUIRED_STRING_FIELDS = [
  'id',
  'name',
  'version',
  'minAppVersion',
] as const satisfies readonly (keyof PluginManifest)[];

function requireNonEmptyString(
  record: Record<string, unknown>,
  field: keyof PluginManifest,
): string {
  const raw = record[field];
  if (typeof raw !== 'string' || raw.length === 0) {
    throw new Error(`Manifest missing or invalid field: ${field}`);
  }
  return raw;
}

export function validateManifest(value: unknown): PluginManifest {
  if (value === null || typeof value !== 'object') {
    throw new Error('Manifest must be an object');
  }

  const record = value as Record<string, unknown>;
  const manifest = Object.fromEntries(
    REQUIRED_STRING_FIELDS.map((field) => [
      field,
      requireNonEmptyString(record, field),
    ]),
  ) as PluginManifest;

  if (manifest.id !== PLUGIN_ID) {
    throw new Error(
      `Manifest id must be "${PLUGIN_ID}", got "${manifest.id}"`,
    );
  }

  return manifest;
}
