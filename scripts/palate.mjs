#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const stable = value => Array.isArray(value) ? '[' + value.map(stable).join(',') + ']' : value && typeof value === 'object' ? '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}' : JSON.stringify(value);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
try {
  for (const name of [project, path.join(project, 'palate.project.json'), path.join(project, '.palate'), path.join(project, '.palate/runtime'), path.join(project, '.palate/runtime/digest.json')]) if (fs.lstatSync(name).isSymbolicLink()) throw new Error('Symlinked runtime paths are unsupported.');
  const state = JSON.parse(fs.readFileSync(path.join(project, 'palate.project.json'), 'utf8'));
  const root = path.join(project, '.palate/runtime');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'digest.json'), 'utf8'));
  if (state.schema !== 1 || state.workflow !== 'live-design' || manifest.schema !== 1 || manifest.version !== state.runtime.version || hash(stable(manifest.files)) !== state.runtime.digest) throw new Error('Pinned runtime identity is invalid.');
  const scan = (directory, prefix = '') => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error('Runtime symlinks are unsupported.');
    return entry.isDirectory() ? scan(path.join(directory, entry.name), name + '/') : [name];
  });
  if (JSON.stringify(scan(root).filter(name => name !== 'digest.json').sort()) !== JSON.stringify(manifest.files.map(file => file.path).sort())) throw new Error('Pinned runtime inventory changed.');
  for (const file of manifest.files) {
    if (typeof file.path !== 'string' || file.path.includes('\\') || file.path.startsWith('/') || file.path.split('/').some(part => !part || part === '..' || part === '.')) throw new Error('Unsafe runtime path.');
    if (hash(fs.readFileSync(path.join(root, file.path))) !== file.sha256) throw new Error('Pinned runtime content changed: ' + file.path);
  }
  const { main } = await import('../.palate/runtime/live/cli.mjs');
  const args = process.argv.slice(2);
  if (!args.includes('--project') && args[0] !== 'init') args.push('--project', project);
  await main(args);
} catch (error) { process.stderr.write(JSON.stringify({ ok: false, code: 'RUNTIME_MISMATCH', message: error.message }) + '\n'); process.exitCode = 1; }
