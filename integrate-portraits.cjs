const fs=require('fs'),path=require('path'),root=path.join(__dirname,'Erreur_de_Casting_V1_Alpha_corrigee');
const d=JSON.parse(fs.readFileSync(path.join(root,'jeu_donnees_v10.json'),'utf8'));
let added=0;
for(const c of d.characters){const revised='illustrations/brut/'+c.id+'-v2.png';const asset=fs.existsSync(path.join(root,revised))?revised:'illustrations/brut/'+c.id+'.png';if((!c.portrait_asset||asset===revised)&&c.portrait_asset!==asset&&fs.existsSync(path.join(root,asset))){c.portrait_asset=asset;added++;}}
fs.writeFileSync(path.join(root,'jeu_donnees_v10.json'),JSON.stringify(d,null,2)+'\n');
fs.writeFileSync(path.join(root,'casting-profils.json'),JSON.stringify(d.characters,null,2));
const file=path.join(root,'index.html');let h=fs.readFileSync(file,'utf8');h=h.replace(/(<script id="dataset" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+'\n'+JSON.stringify(d,null,2)+'\n'+b);fs.writeFileSync(file,h);
const pending=d.characters.filter(c=>!c.portrait_asset).map(c=>({id:c.id,name:c.personnage,manga:c.manga,period:c.periode}));
fs.writeFileSync(path.join(__dirname,'editorial','illustrations-progress.json'),JSON.stringify({illustrated:d.characters.length-pending.length,pending},null,2));
console.log(JSON.stringify({added,illustrated:d.characters.length-pending.length,remaining:pending.length}));
