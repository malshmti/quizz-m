const assert=require('assert/strict'),E=require('./engine'),P=require('./profile'),d=require('./jeu_donnees_v10.json');
const {play}=require('../audit-profiles.cjs');
for(let seed=1;seed<=100;seed++){
const s=play(seed),r=E.evaluate(d,s);
assert.equal(r.facets.length,8);
assert(r.facets.every(f=>f.contexts.length>=3&&f.contexts.length<=4));
const ideal=structuredClone(s);for(const q of d.questions.filter(q=>q.kind==='double'))if(ideal.answers[q.id])ideal.answers[q.id].ideal=q.choices.at(-1).id;
assert.deepEqual(E.pickAdaptives(d,s),E.pickAdaptives(d,ideal),'Ideal answers must not change adaptive selection');
assert.deepEqual(E.evaluate(d,s).ranked,E.evaluate(d,ideal).ranked);
const permuted=structuredClone(d);for(const q of permuted.questions)q.choices.reverse();
assert.deepEqual(E.evaluate(d,s).ranked,E.evaluate(permuted,s).ranked,'Choice display order must not alter scoring');
}
const route=play(1);
for(const dir of [-1,1]){
const s=structuredClone(route);
for(const q of d.questions.filter(q=>q.facet))if(s.answers[q.id])s.answers[q.id]=q.choices.find(c=>q.facet_values[c.id]===dir*2).id;
const f=E.facetEvidence(d,s);assert(f.every(x=>x.status===(dir===1?'high':'low')));
assert(f.every(x=>x.mean===dir*2));
}
const s=structuredClone(route),q=d.questions.find(q=>q.facet==='trust'&&!q.is_adaptive);for(const item of d.questions.filter(x=>x.facet==='trust'&&x.is_adaptive))delete s.answers[item.id];delete s.answers[q.id];
assert.equal(E.facetEvidence(d,s).find(f=>f.id==='trust').status,'insufficient');
const candidate=(id,t)=>({id,personnage:id,manga:'test',traits_exploratoires_sous_reserve:[t]});
const toy={questions:[{id:'T',kind:'qcm',position:1,choices:'ABCD'.split('').map(id=>({id,text:id})),reviewed_motifs:{base:{A:'X',B:'X',C:'X',D:'Y'}}}],characters:[candidate('x','X'),candidate('y','Y')],adaptive_positions:[]};
const sums={x:0,y:0};for(const choice of 'ABCD')for(const c of E.evaluate(toy,{answers:{T:choice}}).ranked)sums[c.id]+=c.score;
assert(Math.abs(sums.x)<1e-10&&Math.abs(sums.y)<1e-10,'Three favorable options must not create a baseline advantage');
const rare=E.evaluate(toy,{answers:{T:'D'}});assert.equal(rare.ranked[0].id,'y');
console.log('OK: 100 routes, 8 facets x at least 3 contexts, ideal separation, option-order invariance, both facet poles, insufficient evidence, chance-centered scores.');

