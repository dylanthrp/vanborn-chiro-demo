// Browser regression audit. AUDIT_URL supports the published preview; never submits clinic forms.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/dylan/Downloads/study-spot/node_modules/playwright')); }
const root = path.resolve(__dirname, '..');
const out = process.env.AUDIT_OUTPUT || path.join(root, '.hermes','vanborn-polish', 'audit-'+Date.now());
fs.mkdirSync(out, {recursive:true});
const files = fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const server = http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try {
  const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
 } catch {res.writeHead(404).end();}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url=(process.env.AUDIT_URL || `http://127.0.0.1:${server.address().port}/`).replace(/\/?$/,'/');
 const browser=await chromium.launch();
 const report={url,screens:[],failures:[]};
 try {
 for(const width of [320,390,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const file of files) {
   const page=await context.newPage();const errors=[],requests=[],failures=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
   const check=(ok,message)=>{if(!ok)failures.push(message);};
   await page.goto(new URL(file,url).href,{waitUntil:'networkidle'});
   for(const image of await page.locator('img').all())await image.scrollIntoViewIfNeeded();
   await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
   const state=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    images:[...document.images].map(i=>({src:i.getAttribute('src'),alt:i.alt,loaded:i.complete&&i.naturalWidth>0})),
    phones:[...document.querySelectorAll('[href^="tel:"]')].map(a=>a.getAttribute('href')),
    main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length,
    forms:document.querySelectorAll('form,textarea,input:not([type="search"])').length,
    noindex:document.querySelector('meta[name="robots"]')?.content.includes('noindex'),
    links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))
   }));
   check(!state.overflow,'Horizontal overflow');check(state.images.every(i=>i.loaded&&i.alt),'Broken/unlabeled image');
   if(file==='index.html')check(['jane-final.jpg','sam-final.jpg','loretta-final.jpg'].every(f=>state.images.some(i=>i.src.endsWith(f))),'Missing supplied staff portraits');
   check(state.phones.length&&state.phones.every(h=>h==='tel:+'+'1'+'313'+'291'+'1060'),'Incorrect phone link');
   check(!state.forms,'Unexpected data collection');check(state.main===1&&state.h1===1,'Missing/duplicate main or H1');check(state.noindex,'Missing preview noindex');
   for(const href of state.links.filter(h=>!/^https?:|^tel:|^mailto:/.test(h))) {
    const dest=new URL(href,new URL(file,url));const local=path.basename(dest.pathname)||'index.html';
    check(files.includes(local),'Missing local page '+href);
    if(dest.hash)check(fs.readFileSync(path.join(root,local),'utf8').includes(`id="${dest.hash.slice(1)}"`),'Missing anchor '+href);
   }
   await page.goto(new URL(file,url).href,{waitUntil:'networkidle'});
   await page.keyboard.press('Tab');check(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),'Skip link not first focus');
   await page.keyboard.press('Enter');check(await page.evaluate(()=>document.activeElement.tagName==='MAIN'),'Skip link does not focus main');
   await page.locator('.topnav').evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top+200));
   const nav=await page.locator('.topnav').boundingBox();check(nav.y>=-1&&nav.y<180,'Topnav not sticky');
   if(width<540)check(nav.height<=70,'Mobile topnav not compact');
   if(file==='index.html')await page.screenshot({path:path.join(out,`sticky-${width}.png`)});
   // Exercise the real navigation, not an obsolete .tn-tab selector.
   await page.locator('.topnav a[data-nav="patients"]').click();
   check(page.url().endsWith('/patient-resources.html'),'Patient navigation failed');
   await page.goto(new URL(file,url).href,{waitUntil:'networkidle'});
   if(file==='index.html'||file==='patient-resources.html') {
    const faq=page.locator('.patient-faq details');check(await faq.count()>=5,'Missing native patient FAQs');
    if(await faq.count()) {const first=faq.first();await first.locator('summary').focus();await page.keyboard.press('Enter');check(await first.getAttribute('open')!==null,'FAQ keyboard open');await page.locator('.patient-faq').screenshot({path:path.join(out,`faq-${file.replace('.html','')}-${width}.png`)});await page.keyboard.press('Space');check(await first.getAttribute('open')===null,'FAQ keyboard close');}
   }
   if(file.startsWith('library-')) {
    const input=page.locator('#library-search');check(await input.count()===1,'Missing library search');
    if(await input.count()) {
     const items=page.locator('.article-titles li');const count=await items.count();
     await input.fill('  cHiRoPrAcTiC  ');check(await page.locator('.article-titles li:visible').count()>0,'Trim/case search failed');
     await input.fill('<no matching article>');check(await page.locator('.article-titles li:visible').count()===0,'Empty-result filter failed');
     check(/No titles match/.test(await page.locator('#library-results').innerText()),'Missing empty state');
     await page.locator('#library-reset').click();check(await page.locator('.article-titles li:visible').count()===count,'Reset did not restore titles');
     check(await input.evaluate(e=>e===document.activeElement),'Reset focus');
     check(await page.locator('.library-topics a').count()===6,'Missing library topic navigation');
    }
   }
   if(file==='index.html'){
    await page.locator('.header-icons a[href="#book"]').click();
    const positions=await page.evaluate(()=>({target:document.getElementById('book').getBoundingClientRect().top,nav:document.querySelector('.topnav').getBoundingClientRect().bottom}));
    check(positions.target>=positions.nav-2,'Appointment anchor obscured');
   }
   await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
   await page.screenshot({path:path.join(out,`${file.replace('.html','')}-${width}.png`),fullPage:true});
   if(file==='index.html')await page.screenshot({path:path.join(out,`hero-${width}.png`)});
   let axe=null;
   if(process.env.AXE_PATH){await page.addScriptTag({path:process.env.AXE_PATH});axe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});check(!axe.length,'Accessibility violations');}
   const thirdParty=requests.filter(r=>/^https?:/.test(r.url)&&new URL(r.url).origin!==new URL(url).origin);
   check(!errors.length,'Console/page errors');check(!thirdParty.length,'Unexpected third-party requests');check(requests.every(r=>r.method==='GET'),'Unexpected non-GET request');
   report.screens.push({file,width,...state,nav,errors,axe,thirdParty,failures});report.failures.push(...failures.map(f=>`${file}@${width}: ${f}`));
   await page.close();
  }
  await context.close();
 }
 // Native links, reading and FAQs remain usable if JavaScript is unavailable.
 const plain=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:320,height:900}});
 for(const file of files){const page=await plain.newPage();await page.goto(new URL(file,url).href);await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('main').evaluate(e=>e===document.activeElement),true,file+' no-JS skip');if(file.startsWith('library-')){assert.equal(await page.locator('.article-titles li:visible').count(),await page.locator('.article-titles li').count());assert.equal(await page.locator('.library-search:visible').count(),0);}if(file==='patient-resources.html'){await page.locator('.patient-faq summary').first().click();assert.notEqual(await page.locator('.patient-faq details').first().getAttribute('open'),null);}await page.close();}
 await plain.close();
 }finally{await browser.close();server.close();fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify(report,null,2));}
 console.log(JSON.stringify({pages:files.length,viewports:4,screens:report.screens.length,noJS:files.length,failures:report.failures,output:out},null,2));
 assert.equal(report.failures.length,0,report.failures.join('\n'));
})().catch(e=>{server.close();console.error(e);process.exitCode=1;});
