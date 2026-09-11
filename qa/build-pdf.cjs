// Generate a printable PDF from qa/proposal-print.html using Playwright (already installed).
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('C:/Users/dylan/Downloads/study-spot/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch();
  try{
    const ctx=await browser.newContext();
    const page=await ctx.newPage();
    const htmlPath='file:///C:/Users/dylan/Documents/vanborn-chiro-demo/qa/proposal-print.html';
    await page.goto(htmlPath,{waitUntil:'domcontentloaded'});
    await page.waitForLoadState('load').catch(()=>{});
    const out='C:/Users/dylan/Documents/vanborn-chiro-demo/Van-Born-Website-Proposal.pdf';
    await page.pdf({
      path:out,
      format:'Letter',
      printBackground:true,
      margin:{top:'0.6in',right:'0.7in',bottom:'0.7in',left:'0.7in'},
      preferCSSPageSize:true,
    });
    const stat=fs.statSync(out);
    console.log(JSON.stringify({pdfPath:out,size:stat.size,ok:true}));
  }finally{
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
