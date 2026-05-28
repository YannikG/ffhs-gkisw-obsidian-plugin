import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const ctx = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'main.js',
  platform: 'node',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',
  external: ['obsidian'],
  loader: {
    '.wasm': 'file',
  },
  assetNames: 'assets/[name]-[hash]',
});

if (watch) {
  await ctx.watch();
} else {
  try {
    await ctx.rebuild();
  } finally {
    await ctx.dispose();
  }
}
