const fs=require('fs'),E=require('./Erreur_de_Casting_V1_Alpha_corrigee/engine'),d=require('./Erreur_de_Casting_V1_Alpha_corrigee/jeu_donnees_v10.json'),{play}=require('./audit-profiles.cjs');
const rows=new Map();let changed=0,total=0;
for(let seed=1;seed<=100;seed++){
 const s=play(seed),initial=E.evaluate(d,s).ranked[0].id;
 for(const q of d.questions.filter(q=>q.facet&&s.answers[q.id])){
  const raw=s.answers[q.id],answer=q.kind==='double'?raw.reel:raw,value=q.facet_values[answer];
  const alternative=q.choices.find(c=>Math.sign(q.facet_values[c.id])===Math.sign(value)&&Math.abs(q.facet_values[c.id]-value)===1);
  if(!alternative)continue;
  const t=structuredClone(s);t.answers[q.id]=q.kind==='double'?{...raw,reel:alternative.id}:alternative.id;
  const flip=E.evaluate(d,t).ranked[0].id!==initial;
  const row=rows.get(q.id)||{id:q.id,title:q.title,total:0,changed:0};row.total++;row.changed+=Number(flip);rows.set(q.id,row);total++;changed+=Number(flip);
 }
}
const report={method:'100 parcours aléatoires reproductibles ; chaque réponse de facette est remplacée, quand cela est possible, par l’intensité voisine du même pôle (1 ↔ 2 ou −1 ↔ −2). Une modification à la fois, sélection adaptative conservée. Les réponses neutres sont exclues. Ce contrôle logiciel ne mesure pas la fidélité chez des joueurs réels.',total,changed,questions:[...rows.values()].sort((a,b)=>b.changed/b.total-a.changed/a.total)};
fs.writeFileSync('audit/stability-v62.json',JSON.stringify(report,null,2));console.log(JSON.stringify({changed,total}));
