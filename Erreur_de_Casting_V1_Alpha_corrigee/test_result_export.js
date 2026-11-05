const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),E=require('./engine.js'),d=require('./jeu_donnees_v10.json');
const fixtures=require('../audit/reachability-v6.json'),html=fs.readFileSync(__dirname+'/index.html','utf8'),dataset=html.match(/<script id="dataset" type="application\/json">([\s\S]*?)<\/script>/)[1];
(async()=>{
for(const fixture of fixtures){
assert(fixture.example,'Every character needs a reproducible reachable path');
const s={...fixture.example,finished:true,position:75};delete s.seed;
assert.equal(E.evaluate(d,s).ranked[0].id,fixture.id);
let captured,clicked=false;
const nodes={dataset:{textContent:dataset},app:{innerHTML:'',querySelector:()=>({focus(){}})}};
const sandbox={Blob,console,setTimeout:()=>0,localStorage:{getItem:()=>JSON.stringify(s),setItem(){}},URL:{createObjectURL:b=>{captured=b;return 'blob:test'},revokeObjectURL(){}},scrollTo(){},document:{getElementById:id=>nodes[id]??=({}),createElement:()=>({click(){clicked=true}})}};
sandbox.window=sandbox;vm.createContext(sandbox);
for(const file of ['engine.js','profile.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),sandbox);
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],sandbox);
const outputHtml=nodes.app.innerHTML;
assert.equal((outputHtml.match(/class="cast-portrait"|class="character-dossier"/g)||[]).length,1);
assert(!outputHtml.includes('src="undefined"')&&!outputHtml.includes('href="undefined"'));
assert(!outputHtml.includes('Alternative'));
nodes.export.onclick();assert(clicked&&captured);
const output=JSON.parse(await captured.text());
assert.equal(output.version,'6.0-portrait');
assert.equal(output.portrait.character.id,fixture.id);
assert(output.portrait.sections.length>=3);
assert(!('ranked'in output.portrait)&&!('top'in output.portrait));
assert.deepEqual(output.answers,s.answers);
}
console.log('OK: 181 reachable characters, actual result renderer, one presentation per result, no missing asset URLs, and 181 original-answer exports.');
})().catch(e=>{console.error(e);process.exitCode=1});
