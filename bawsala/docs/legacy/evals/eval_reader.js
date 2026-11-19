// Measures the built-in skill reader against qa/eval_set.json. split: all|dev|test
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../src/app.js','utf8');
const grab=(a,b)=>{const i=src.indexOf(a);const j=src.indexOf(b,i);return src.slice(i,j)};
const hint=grab('HINT = {','\n}, LANG_WORDS')+'\n}';
const lw=grab('LANG_WORDS = [','\n')
const normLine=grab('const norm = ','\n');
const neg=grab('function negated(','\n}\n')+'\n}';
const sent=grab('const sentences = ',', uid =');
const code=`const ${hint};\nconst ${lw.replace(/,\s*$/,'').replace(/[,;]\s*[A-Za-z_]+\s*=.*$/,'')}\n${normLine.replace(/,\s*$/,';')}\n${neg}\n${sent};\n
function read(e){const s=sentences(e).map(norm),a=[];e=norm(e);for(const i of Object.keys(HINT)){if(i==='multilingual'&&LANG_WORDS.filter(r=>r.test(e)).length<2)continue;const o=s.find(x=>HINT[i].test(x)&&!negated(x,HINT[i]));o&&a.push(i)}return a}
module.exports=read;`;
fs.writeFileSync('/tmp/_reader.js',code);const read=require('/tmp/_reader.js');
const set=JSON.parse(fs.readFileSync(__dirname+'/'+(process.env.SET||'eval_set.json'),'utf8'));const split=process.argv[2]||'all';const verbose=process.argv.includes('-v');
const by={};let TP=0,FP=0,FN=0;
set.forEach(([l,t,g],i)=>{if(split==='dev'&&i%2)return;if(split==='test'&&!(i%2))return;const p=read(t);const b=by[l]||(by[l]={tp:0,fp:0,fn:0});
 const tp=p.filter(x=>g.includes(x)),fp=p.filter(x=>!g.includes(x)),fn=g.filter(x=>!p.includes(x));b.tp+=tp.length;b.fp+=fp.length;b.fn+=fn.length;TP+=tp.length;FP+=fp.length;FN+=fn.length;
 if(verbose&&(fp.length||fn.length))console.log(l,'|',t,'| miss:',fn.join(','),'| wrong:',fp.join(','))});
const f=(b)=>{const r=b.tp/(b.tp+b.fn||1),p=b.tp/(b.tp+b.fp||1);return `recall ${(100*r).toFixed(0)}%  precision ${(100*p).toFixed(0)}%`};
for(const l in by)console.log(split,l,f(by[l]));console.log(split,'ALL',f({tp:TP,fp:FP,fn:FN}));
