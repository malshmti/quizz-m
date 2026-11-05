/* Erreur de Casting — prototype qualitatif, sans diagnostic psychologique. */
(function(root,factory){ const api=factory(); if (typeof module==='object' && module.exports) module.exports=api; root.EDC=api; })(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const byId=(data,id)=>data.questions.find(q=>q.id===id);
const answerChoice=(value)=>typeof value==='string'?value:(value&&value.reel)||null;
function route(data, adaptiveIds=[]){
 const placed={}; for(const q of data.questions){if(!q.is_adaptive) placed[q.position]=q.id;}
 (data.adaptive_positions||[]).forEach((pos,i)=>{if(adaptiveIds[i])placed[pos]=adaptiveIds[i]});
 return Array.from({length:75},(_,i)=>placed[i+1]||null);
}
function resolve(data,q,state){
 const choices=q.choices||[];
 let body=q.body||'', prefix='', sceneKey='base', validChoices=choices;
 if(q.branches && Object.keys(q.branches).length){
  const entries=Object.entries(q.branches);
  const branch=entries.find(([predicate])=>predicate.split(';').every(pair=>{
   const [id,val]=pair.split('=');return answerChoice(state.answers[id])===val;
  }));
  if(!branch) return {id:q.id,kind:q.kind,body:'Épisode précédent à compléter.', choices:[],sceneKey:'missing',ready:false};
  sceneKey=branch[0]; const b=branch[1];
  if(b.scene){body=b.scene+(b.question?'\n\n'+b.question:'');validChoices=b.choices||choices;}
  else {prefix=b.scene_prefix||''; if(prefix)body=prefix+'\n\n'+body;validChoices=choices;}
 }
 return {id:q.id,kind:q.kind,title:q.title,body,choices:validChoices,sceneKey,ready:true,theme:q.theme};
}
function pickAdaptives(data,state){
 const existing=data.questions.filter(q=>!q.is_adaptive&&q.position<=61);
 const priorIds=new Set(existing.map(q=>q.id));
 state={...state,adaptiveIds:[],answers:Object.fromEntries(Object.entries(state.answers).filter(([id])=>priorIds.has(id)))};
 const counts={},signals={},narrativeContexts={},motifContexts={},extraCoverage={}; Object.keys(data.themes).forEach(t=>{counts[t]=0;signals[t]=0});
 // Combine thematic coverage and actual choices that already provide contextual evidence.
 // An episode of the same adventure is ONE context for thematic saturation.
 for(const q of existing){counts[q.theme]=(counts[q.theme]||0)+1;
   if(!state.answers[q.id])continue;
   const sc=resolve(data,q,state);if(!sc.ready)continue;
   const m=getMotif(q,sc,answerChoice(state.answers[q.id]));
   const context=q.arc||q.id;
   if(m)(motifContexts[m]??=new Set()).add(context);
   if(m && !narrativeContexts[q.theme+'|'+context]){signals[q.theme]++;narrativeContexts[q.theme+'|'+context]=true}
 }
 let pool=data.questions.filter(q=>q.is_adaptive);
 const chosen=[];
 const leading=evaluate(data,state).ranked.slice(0,6).map(r=>data.characters.find(c=>c.id===r.id));
 const discriminating={};for(const facet of Object.keys(data.facets||{})){const values=leading.map(c=>c.facet_profile?.[facet]).filter(Number.isFinite),mean=values.reduce((a,b)=>a+b,0)/(values.length||1);discriminating[facet]=values.reduce((sum,v)=>sum+(v-mean)**2,0)/(values.length||1);}
 const facetCounts={};for(const q of data.questions.filter(q=>!q.is_adaptive))if(q.facet)facetCounts[q.facet]=(facetCounts[q.facet]||0)+1;
 const fingerprint=Object.entries(state.answers).sort().map(([k,v])=>[k,Array.isArray(v)?v:answerChoice(v)]).map(([k,v])=>`${k}:${JSON.stringify(v)}`).join('|');
 let seed=5381; for(let i=0;i<fingerprint.length;i++)seed=((seed*33)^fingerprint.charCodeAt(i))>>>0;
 const tags=q=>[...new Set(Object.values(q.reviewed_motifs||{}).flatMap(m=>Object.values(m)))];
 const information=q=>{const t=tags(q);return t.length?t.reduce((s,k)=>s+1/(1+(motifContexts[k]?.size||0)+(extraCoverage[k]||0)),0)/t.length:0;};
 for(let i=0;i<10;i++){
  pool.sort((a,b)=>{
   const missing=q=>q.facet?Math.max(0,3-(facetCounts[q.facet]||0)):0;
   if(missing(a)!==missing(b))return missing(b)-missing(a);
   if(missing(a)>0&&!!a.refinement!==!!b.refinement)return Number(!!a.refinement)-Number(!!b.refinement);
   if(missing(a)===0){const gain=q=>q.refinement?(discriminating[q.facet]||0)/(1+(facetCounts[q.facet]||0)):0;if(gain(a)!==gain(b))return gain(b)-gain(a);}
   const x=(counts[a.theme]||0)*.16+(signals[a.theme]||0)*.3-information(a)*2.5;
   const y=(counts[b.theme]||0)*.16+(signals[b.theme]||0)*.3-information(b)*2.5;
   if(x!==y)return x-y;
   const score=(id)=>{let n=seed;for(let i=0;i<id.length;i++)n=Math.imul(n^id.charCodeAt(i),16777619)>>>0;n^=n>>>16;n=Math.imul(n,0x85ebca6b);return (n^(n>>>13))>>>0;};
   return score(a.id)-score(b.id) || a.id.localeCompare(b.id);
  });
  const q=pool.shift();chosen.push(q.id);if(q.facet)facetCounts[q.facet]=(facetCounts[q.facet]||0)+1;counts[q.theme]++;for(const t of tags(q))extraCoverage[t]=(extraCoverage[t]||0)+.5;
 }
 return chosen;
}
function getMotif(q,scene,answer){
 const map=q.reviewed_motifs||{};
 const m=map[scene.sceneKey] || map.base || {};
 return m[answer]||null;
}
function observations(data,state){
 let rows=[]; const routeIds=route(data,state.adaptiveIds||[]);
 for(let i=0;i<routeIds.length;i++){
  const id=routeIds[i];if(!id||!state.answers[id])continue;
  const q=byId(data,id),scene=resolve(data,q,state),raw=state.answers[id];
  if(!scene.ready)continue;
  let val=answerChoice(raw);
  if(q.kind==='classement'){
   if(!validateAnswer({...q,choices:scene.choices},raw))continue;
   rows.push({id,chapter:Math.ceil((i+1)/15),mode:'classement',theme:q.theme,ranking:raw,motif:null,context:q.arc||id,text:'Classement relatif : '+raw.join(' → ')});
   continue;
  }
  const selected=scene.choices.find(c=>c.id===val);if(!selected)continue;
  rows.push({id,chapter:Math.ceil((i+1)/15),mode:'réel',theme:q.theme,choice:val,text:selected.text,motif:getMotif(q,scene,val),context:q.arc||id,sceneKey:scene.sceneKey});
  if(q.kind==='double'&&raw.ideal){let ideal=scene.choices.find(c=>c.id===raw.ideal);if(ideal)rows.push({id,mode:'idéal',theme:q.theme,choice:raw.ideal,text:ideal.text,motif:null,context:q.arc||id})}
 }
 return rows;
}
function patterns(rows){
 const byTag={};
 for(const r of rows){ if(r.mode!=='réel'||!r.motif)continue;
  if(!byTag[r.motif])byTag[r.motif]={tag:r.motif,contexts:new Set(),examples:[],themes:new Set()};
  const e=byTag[r.motif];e.contexts.add(r.context);e.themes.add(r.theme);e.examples.push({id:r.id,text:r.text,context:r.context});
 }
 return Object.values(byTag).map(x=>({...x,contexts:[...x.contexts],themes:[...x.themes]})).sort((a,b)=>b.contexts.length-a.contexts.length||a.tag.localeCompare(b.tag));
}
function facetEvidence(data,state){
 const groups={};
 for(const id of route(data,state.adaptiveIds||[])){
  const q=byId(data,id);if(!q?.facet)continue;
  const choice=answerChoice(state.answers[id]),value=q.facet_values?.[choice];if(!Number.isFinite(value))continue;
  const sc=resolve(data,q,state);if(!sc.ready||!sc.choices.some(c=>c.id===choice))continue;
  (groups[q.facet]??=[]).push({id,choice,value,text:sc.choices.find(c=>c.id===choice).text,context:q.arc||id});
 }
 return Object.entries(groups).map(([id,items])=>{
  const contexts=[...new Set(items.map(x=>x.context))],mean=items.reduce((s,x)=>s+x.value,0)/items.length;
  const positive=items.filter(x=>x.value>0).length,negative=items.filter(x=>x.value<0).length;
  return {id,items,contexts,mean,status:contexts.length<3?'insufficient':positive===items.length?'high':negative===items.length?'low':'contextual'};
 });
}
function evaluate(data,state){
 const rows=observations(data,state), patt=patterns(rows), byTag=Object.fromEntries(patt.map(p=>[p.tag,p])), facets=facetEvidence(data,state);
 const prepared=rows.filter(r=>r.mode==='réel'&&r.motif).map(row=>{const q=byId(data,row.id),sc=resolve(data,q,state);return {...row,annotated:sc.choices.map(c=>getMotif(q,sc,c.id)).filter(Boolean)}});
 // Count independent situations in which a motif was actually available on this route.
 // Repeated adventure episodes never become independent evidence.
 const opportunities={};
 for(const id of route(data,state.adaptiveIds||[])){
  if(!id||!state.answers[id])continue;
  const q=byId(data,id);if(q.kind==='classement')continue;
  const scene=resolve(data,q,state);if(!scene.ready)continue;
  for(const c of scene.choices){const tag=getMotif(q,scene,c.id);if(tag)(opportunities[tag]??=new Set()).add(q.arc||id);}
 }
 const chars=data.characters||[], freq={};
 for(const p of chars)for(const tag of new Set(p.traits_exploratoires_sous_reserve||[]))freq[tag]=(freq[tag]||0)+1;
 const importance=t=>1+Math.log(1+chars.length/(1+(freq[t]||0)))*.3;
 const signal=t=>(byTag[t]?.contexts.length||0)/(2+(opportunities[t]?.size||0));
 
 const ranked=chars.map(p=>{
  const overlap=(p.traits_exploratoires_sous_reserve||[]).filter(t=>byTag[t]);
  const matching=overlap.map(t=>{
   const pattern=byTag[t],diversity=pattern.contexts.length;
   return {tag:t,contexts:diversity,weight:importance(t)*signal(t),examples:pattern.examples.slice(0,2)};
  }).sort((a,b)=>b.weight-a.weight);
  
  // Center support against the options actually offered, not a quota of winners.
  // An unannotated choice is unknown, not evidence against a character.
  const contexts={};const signature=new Set(p.traits_exploratoires_sous_reserve||[]);
  for(const row of prepared){
   const annotated=row.annotated;
   const baseline=annotated.filter(t=>signature.has(t)).length/annotated.length;
   if(baseline<=0||baseline>=1)continue;
   const context=contexts[row.context]??={sum:0,variance:0,n:0};
   context.sum+=(signature.has(row.motif)?1:0)-baseline;
   context.variance+=baseline*(1-baseline);context.n++;
  }
  const independent=Object.values(contexts);
  const motifScore=independent.reduce((sum,c)=>sum+c.sum/c.n,0)/Math.sqrt(2+independent.reduce((sum,c)=>sum+c.variance/c.n,0));
  const compared=facets.filter(f=>f.contexts.length>=(data.scoring_policy?.minimumFacetContexts||2)&&Number.isFinite(p.facet_profile?.[f.id]));
  const facetDistance=compared.length?compared.reduce((sum,f)=>sum+(f.mean-p.facet_profile[f.id])**2,0)/compared.length:null;
  const raw=facetDistance===null?motifScore:-(data.scoring_policy?.facetWeight??1)*facetDistance+(data.scoring_policy?.motifWeight??.06)*Math.tanh(motifScore/2);
  const contextCount=new Set(matching.flatMap(m=>m.examples.map(e=>e.context))).size;
  // Demonstration-only: scores are *relative alignment indices*, never compatibility percents.
  return {id:p.id,name:p.personnage,manga:p.manga,score:raw,facetDistance,motifScore,facetMatches:compared.map(f=>({id:f.id,observed:f.mean,target:p.facet_profile[f.id],contexts:f.contexts.length})),portraitAsset:p.portrait_asset||null,motivation:p.motivation||null,counterpoint:p.contreexemple||null,period:p.periode,referenceContext:p.reference_context||null,matched:matching,contexts:contextCount,source:p.reference_editeur,premise:p.scene_attestee};
 }).sort((a,b)=>b.score-a.score || b.matched.length-a.matched.length || a.name.localeCompare(b.name));
 const observed=rows.filter(r=>r.mode==='réel'&&r.motif).length;
 const confidence=observed<5||patt.length<3?'insuffisant':(ranked.length>1&&ranked[0].score-ranked[1].score<0.025?'ex_aequo':'exploratoire');
 return {status:confidence,rows,patterns:patt,facets,ranked,annotated:observed,totalRows:rows.filter(r=>r.mode==='réel').length,
 caveat:'Résultat exploratoire : 181 personnages à signatures éditoriales hypothétiques. Aucune probabilité ni validation psychologique.'};
}
function validateAnswer(q,v){
 const valid=new Set((q.choices||[]).map(c=>c.id));
 if(q.kind==='classement')return Array.isArray(v)&&v.length===4&&new Set(v).size===4&&v.every(k=>valid.has(k));
 if(q.kind==='double')return !!(v&&valid.has(v.reel)&&valid.has(v.ideal));
 return typeof v==='string'&&valid.has(v);
}
return {route,resolve,pickAdaptives,observations,patterns,evaluate,validateAnswer,byId,facetEvidence};
});


