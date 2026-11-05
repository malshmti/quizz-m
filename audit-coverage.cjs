const fs=require('fs'),d=require('./Erreur_de_Casting_V1_Alpha_corrigee/jeu_donnees_v10.json');
const stats={};const rows=[];
for(const q of d.questions){const scenes=q.branches&&Object.values(q.branches).some(b=>b.choices)?Object.entries(q.branches):[['base',{choices:q.choices}]];
for(const [key,b]of scenes){const choices=b.choices||q.choices,map=q.reviewed_motifs[key]||q.reviewed_motifs.base||{};
for(const c of choices){const tag=map[c.id];if(tag){stats[tag]??={questions:new Set(),fixed:new Set(),options:0};stats[tag].questions.add(q.id);if(!q.is_adaptive)stats[tag].fixed.add(q.arc||q.id);stats[tag].options++;}
rows.push({id:q.id,title:q.title,adaptive:q.is_adaptive,context:q.arc||q.id,scene:key,choice:c.id,text:c.text,motif:tag||null,kind:q.kind});}}}
const out={questions:d.questions.length,options:rows.length,scored:rows.filter(r=>r.motif).length,unscoredQuestions:d.questions.filter(q=>!rows.some(r=>r.id===q.id&&r.motif)).map(q=>q.id),motifs:Object.fromEntries(Object.entries(stats).sort((a,b)=>b[1].fixed.size-a[1].fixed.size).map(([t,s])=>[t,{questions:s.questions.size,fixedContexts:s.fixed.size,options:s.options,characters:d.characters.filter(c=>c.traits_exploratoires_sous_reserve.includes(t)).map(c=>c.id)}])),rows};
fs.mkdirSync('audit',{recursive:true});fs.writeFileSync('audit/before.json',JSON.stringify(out,null,2));
console.log(JSON.stringify({...out,rows:undefined},null,2));
