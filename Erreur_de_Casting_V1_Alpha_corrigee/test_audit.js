const assert=require('assert/strict'),fs=require('fs'),vm=require('vm');
const d=require('./audit.json'),source=fs.readFileSync(__dirname+'/audit.html','utf8');
assert.equal(d.characters.length,181);
for(const row of d.neighbors){assert.equal(row.nearest.length,2);assert(row.nearest[0].distance<=row.nearest[1].distance);for(const n of row.nearest)assert(Number.isFinite(n.distance)&&n.distance>=0);}
assert.equal(d.stability.questions.reduce((s,q)=>s+q.total,0),d.stability.total);
assert.equal(d.stability.questions.reduce((s,q)=>s+q.changed,0),d.stability.changed);
assert(d.characters.find(c=>c.id==='mori').documentaryNotes.length);
const elements=new Map();const document={getElementById(id){if(!elements.has(id))elements.set(id,{value:id.endsWith('filter')?'all':'',innerHTML:'',textContent:'',addEventListener(){}});return elements.get(id)}};
vm.runInNewContext(source.match(/<script>([\s\S]*?)<\/script>/)[1],{document,fetch:async()=>({ok:true,json:async()=>d}),console});
setImmediate(()=>{assert.equal(document.getElementById('status').textContent,'');assert(document.getElementById('report').innerHTML.includes('Stabilité des facettes'));assert(document.getElementById('crows').innerHTML.includes('Résumé éditeur'));console.log('OK: audit rendering, 181 profiles, documentary notes, facet neighbors and stability totals.');});
