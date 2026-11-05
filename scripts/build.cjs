const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'Erreur_de_Casting_V1_Alpha_corrigee');
const output = path.join(root, 'dist');
// This fixed output directory contains generated files only.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const files = fs.readdirSync(source).filter(name =>
  /\.(html|css|json)$/.test(name) && !name.startsWith('_') || ['engine.js', 'profile.js'].includes(name));
for (const name of files) fs.copyFileSync(path.join(source, name), path.join(output, name));
fs.cpSync(path.join(source, 'illustrations'), path.join(output, 'illustrations'), { recursive: true });
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('Site statique prêt dans dist/');
