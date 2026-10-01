// Validate linked clinic resources without submitting forms or patient information.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 const html=fs.readdirSync(root).filter(f=>f.endsWith('.html')).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 const urls=[...new Set([...html.matchAll(/href="(https:\/\/(?:www\.)?vanbornchiropractic\.com\/[^\"]*)"/g)].map(m=>m[1].replace(/&amp;/g,'&')))];
 assert.ok(urls.length>0,'No linked original clinic resources');
 const results=await Promise.all(urls.map(async url=>{
  try {
   const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
   const body=await response.text();
   const title=body.match(/<title[^>]*>([^<]*)/i)?.[1]||'';
   return {url,status:response.status,title,ok:response.ok&&!/404|not found/i.test(title)};
  } catch(e){return {url,ok:false,error:e.message};}
 }));
 const out=process.env.AUDIT_OUTPUT || path.join(root,'.hermes','vanborn-polish','sources-'+Date.now());
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'source-links.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 assert.ok(results.every(r=>r.ok),'One or more source links failed');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
