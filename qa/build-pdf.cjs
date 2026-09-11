// Generate a printable PDF from qa/proposal-print.html using Playwright (already installed).
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('C:/Users/dylan/Downloads/study-spot/node_modules/playwright');

(async()=>{
 const htmlPath=path.resolve(__dirname,'..','qa','proposal-print.html');
 const pdfPath=path.resolve(__dirname,'..','Van-Born-Website-Proposal.pdf');
 const url='file:///'+htmlPath.replace(/\\/g,'/');
 const browser=await chromium.launch();
 try{
  const ctx=await browser.newContext();
  const page=await ctx.newPage();
  await page.goto(url,{waitUntil:'networkidle',timeout:20000});
  await page.emulateMedia({media:'print'});
  await page.pdf({
   path:pdfPath,
   format:'Letter',
   printBackground:true,
   margin:{top:'0.6in',bottom:'0.7in',left:'0.55in',right:'0.55in'},
   preferCSSPageSize:true,
  });
  await ctx.close();
  const size=fs.statSync(pdfPath).size;
  console.log(JSON.stringify({pdfPath, size, ok:size>0}));
 }finally{await browser.close();}
})().catch(e=>{ console.error('ERR:',e.message); process.exitCode=1; });
