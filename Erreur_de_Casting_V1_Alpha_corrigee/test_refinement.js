const assert=require('assert/strict'),E=require('./engine'),d=require('./jeu_donnees_v10.json'),{play}=require('../audit-profiles.cjs');
for(let seed=1;seed<=20;seed++){
const s=play(seed),early={...s,adaptiveIds:[],answers:Object.fromEntries(Object.entries(s.answers).filter(([id])=>{const q=E.byId(d,id);return !q.is_adaptive&&q.position<=61}))};
const selected=E.pickAdaptives(d,early);
assert.equal(selected.length,10);assert.equal(new Set(selected).size,10);
assert(selected.slice(0,8).every(id=>E.byId(d,id).facet&&!E.byId(d,id).refinement));
const final=selected.slice(8).map(id=>E.byId(d,id));
assert(final.every(q=>q.refinement),'The two remaining questions refine leading profiles');
assert.equal(new Set(final.map(q=>q.facet)).size,2);
assert.deepEqual(E.pickAdaptives(d,s),selected,'Future and previous adaptive answers cannot leak into selection');
const altered=structuredClone(early);for(const q of d.questions.filter(q=>q.kind==='double'))if(altered.answers[q.id])altered.answers[q.id].ideal=q.choices.at(-1).id;
assert.deepEqual(E.pickAdaptives(d,altered),selected);
}
assert.doesNotThrow(()=>E.evaluate(d,{answers:{C07:'A'}}),'Malformed ranking should be ignored, not crash');
console.log('OK: targeted refinements, full facet coverage, distinct refinement dimensions, no future-answer or ideal leakage, malformed ranking guard.');
