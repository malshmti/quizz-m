/* Standalone release checks: run with Node.js: node test_release.js */
const fs=require('fs'),assert=require('assert'),E=require('./engine.js');
const data=JSON.parse(fs.readFileSync(__dirname+'/jeu_donnees_v10.json','utf8'));
assert.equal(data.questions.length,126);assert.equal(new Set(data.questions.map(q=>q.id)).size,126);
assert.equal(data.characters.length,181);assert.equal(data.candidate_registry.length,181);
const initial=E.route(data,[]);assert.equal(initial.filter(Boolean).length,65);
const select=E.pickAdaptives(data,{answers:{}});assert.equal(select.length,10);assert.equal(new Set(select).size,10);
const route=E.route(data,select);assert(route.every(Boolean));assert.equal(route.filter(x=>x.startsWith('N')).length,12);
const groups=[['N01','N04','N07','N10'],['N02','N05','N08','N11'],['N03','N06','N09','N12']];
let total=0;
for(const group of groups){for(const a of 'ABCD')for(const b of 'ABCD')for(const c of 'ABCD')for(const d of 'ABCD'){
 const answers={};for(const [id,choice] of [[group[0],a],[group[1],b],[group[2],c],[group[3],d]]){
   const scene=E.resolve(data,E.byId(data,id),{answers});assert(scene.ready,id);assert.equal(scene.choices.length,4);assert(scene.body.length>30);answers[id]=choice;
 }total++;
}}
assert.equal(total,768);
const values={};for(const id of route){const q=E.byId(data,id),scene=E.resolve(data,q,{answers:values});assert(scene.ready,id);
const ans=q.kind==='classement'?['A','B','C','D']:q.kind==='double'?{reel:'A',ideal:'B'}:'A';assert(E.validateAnswer({...q,choices:scene.choices},ans));values[id]=ans;}
const result=E.evaluate(data,{answers:values,adaptiveIds:select});assert.equal(result.totalRows,72);assert.equal(result.ranked.length,181);assert(result.caveat);
const picksA=E.pickAdaptives(data,{answers:Object.fromEntries(route.filter(q=>!q.startsWith('A')).map(id=>[id,'A']))});
const picksC=E.pickAdaptives(data,{answers:Object.fromEntries(route.filter(q=>!q.startsWith('A')).map(id=>[id,'C']))});
assert.notDeepEqual(picksA,picksC,'selection should genuinely depend on earlier responses');
console.log('OK: 126 questions, 181 casting candidates, 181 editorial profiles, 768 stories, 75-step game, response-sensitive adaptive selection.');
