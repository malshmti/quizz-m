const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'Erreur_de_Casting_V1_Alpha_corrigee');
for (const suite of ['release', 'profiles', 'audit', 'coverage', 'refinement', 'result_export']) {
  console.log(`\n--- ${suite} ---`);
  const result = spawnSync(process.execPath, [path.join(root, `test_${suite}.js`)], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
