const fs=require('fs'),E=require('./Erreur_de_Casting_V1_Alpha_corrigee/engine'),d=require('./Erreur_de_Casting_V1_Alpha_corrigee/jeu_donnees_v10.json');
function targetPlay(c,seed=1){let n=seed;const rand=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);const s={answers:{},adaptiveIds:[],position:75,finished:true},count={};
for(let pos=1;pos<=75;pos++){
if(pos===62)s.adaptiveIds=E.pickAdaptives(d,s);const q=E.byId(d,E.route(d,s.adaptiveIds)[pos-1]),sc=E.resolve(d,q,s),map=q.reviewed_motifs[sc.sceneKey]||q.reviewed_motifs.base||{};
let pool=sc.choices;
if(q.facet){const v=c.facet_profile[q.facet],i=count[q.facet]||0;if(!q.refinement)count[q.facet]=i+1;const target=v===0?(q.refinement?0:[1,1,-2][i]):v;pool=pool.filter(x=>q.facet_values[x.id]===target);}
else {const preferred=pool.filter(x=>c.traits_exploratoires_sous_reserve.includes(map[x.id]));if(preferred.length)pool=preferred;}
if(!pool.length)throw Error(c.personnage+' '+q.id+' '+q.facet+' count '+count[q.facet]);const choice=pool[Math.floor(rand()*pool.length)].id;
s.answers[q.id]=q.kind==='classement'?sc.choices.map(x=>({id:x.id,n:rand()})).sort((a,b)=>a.n-b.n).map(x=>x.id):q.kind==='double'?{reel:choice,ideal:choice}:choice;
}return s}
if(require.main===module){
const reports=[];for(const c of d.characters){let wins=0,example=null,loss=null;for(let i=1;i<=12;i++){const s=targetPlay(c,i),r=E.evaluate(d,s);if(r.ranked[0].id===c.id){wins++;example??={seed:i,answers:s.answers,adaptiveIds:s.adaptiveIds}}else loss=r.ranked.slice(0,3).map(x=>({id:x.id,score:x.score,dist:x.facetDistance}));}
reports.push({id:c.id,name:c.personnage,wins,trials:12,example,loss});}
fs.writeFileSync('audit/reachability-v6.json',JSON.stringify(reports,null,2));console.log(JSON.stringify({reachable:reports.filter(c=>c.wins).length,total:reports.length,unreachable:reports.filter(c=>!c.wins).map(c=>({id:c.id,name:c.name,loss:c.loss}))},null,2));
}
module.exports={targetPlay};


