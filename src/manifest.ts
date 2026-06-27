import meta from '../manifest.meta.json';

export const PLUGIN_ID = meta.id as typeof meta.id;
export const PLUGIN_DISPLAY_NAME = meta.name;

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
  minAppVersion: string;
  description: string;
  author: string;
  isDesktopOnly: boolean;
};

const REQUIRED_STRING_FIELDS = [
  'id',
  'name',
  'version',
  'minAppVersion',
  'description',
  'author',
] as const satisfies readonly (keyof PluginManifest)[];

function requireNonEmptyString(
  record: Record<string, unknown>,
  field: (typeof REQUIRED_STRING_FIELDS)[number],
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
  const strings = Object.fromEntries(
    REQUIRED_STRING_FIELDS.map((field) => [field, requireNonEmptyString(record, field)]),
  ) as Pick<PluginManifest, 'id' | 'name' | 'version' | 'minAppVersion' | 'description' | 'author'>;

  if (typeof record.isDesktopOnly !== 'boolean') {
    throw new Error('Manifest missing or invalid field: isDesktopOnly');
  }

  const manifest: PluginManifest = {
    ...strings,
    isDesktopOnly: record.isDesktopOnly,
  };

  if (manifest.id !== PLUGIN_ID) {
    throw new Error(`Manifest id must be "${PLUGIN_ID}", got "${manifest.id}"`);
  }

  return manifest;
}

/** Canonical manifest object (from manifest.meta.json). */
export function getObsidianManifest(): PluginManifest {
  return validateManifest(meta);
}
