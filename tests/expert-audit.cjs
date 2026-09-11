// Repeatable browser audit. Uses installed Playwright; AXE_PATH enables axe-core.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/dylan/Downloads/study-spot/node_modules/playwright')); }
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'qa');
fs.mkdirSync(out, {recursive:true});
const server = http.createServer((req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  try {
    const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
    res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  } catch {res.writeHead(404).end();}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url = process.env.AUDIT_URL || `http://127.0.0.1:${server.address().port}/`;
 const browser = await chromium.launch();
 const report={url, testedAt:new Date().toISOString(), screens:[],failures:[]};
 try {
 for (const width of [320,390,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[]; const requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
  const response=await page.goto(url,{waitUntil:'networkidle'});
  for(const img of await page.locator('img').all()) await img.scrollIntoViewIfNeeded();
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
  const state=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth,
   images:[...document.images].map(i=>({src:i.getAttribute('src'),alt:i.alt,width:i.naturalWidth,loaded:i.complete&&i.naturalWidth>0})),
   deadLinks:[...document.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href')==='#'||(a.getAttribute('href').startsWith('#')&&!document.getElementById(a.getAttribute('href').slice(1)))).map(a=>a.outerHTML),
   phoneLinks:[...document.querySelectorAll('a[href^="tel:"]')].map(a=>a.getAttribute('href')),
   forms:document.querySelectorAll('form,input,textarea').length,
   main:document.querySelectorAll('main').length,
   noindex:document.querySelector('meta[name="robots"]')?.content.includes('noindex'),
   title:document.title
  }));
  const failures=[];
  if(response.status()!==200) failures.push('HTTP '+response.status());
  if(state.overflow) failures.push('Horizontal overflow');
  if(state.images.some(i=>!i.loaded||!i.alt)) failures.push('Broken or unlabeled image');
  if(state.images.filter(i=>/jane-carroll|IMG_2608-200|Loretta-Klapko/.test(i.src)).length!==3) failures.push('Missing staff portraits');
  if(state.deadLinks.length) failures.push('Dead anchor links');
  if(state.phoneLinks.some(h=>h!=='tel:+13132911060')) failures.push('Incorrect phone link');
  if(state.forms) failures.push('Demo still collects visitor data');
  if(state.main!==1) failures.push('Missing main landmark');
  if(!state.noindex) failures.push('Missing demo noindex');
  await page.goto(url,{waitUntil:'networkidle'});
  await page.keyboard.press('Tab');
  const firstFocus=await page.evaluate(()=>({text:document.activeElement.textContent.trim(),href:document.activeElement.getAttribute('href')}));
  if(!/skip/i.test(firstFocus.text)) failures.push('Keyboard skip link not first focus');
  await page.keyboard.press('Enter');
  if(!await page.evaluate(()=>document.activeElement.tagName==='MAIN')) failures.push('Skip link does not focus main content');
  const nav=[];
  for(const link of await page.locator('.tn-tab').all()) {
    const href=await link.getAttribute('href');
    await link.click();
    const box=await page.evaluate(h=>{
      const target=document.querySelector(h);
      const header=document.querySelector('header.top').getBoundingClientRect();
      const tabs=document.querySelector('.topnav').getBoundingClientRect();
      return {target:target?.getBoundingClientRect().top,edge:Math.max(header.bottom,tabs.bottom)};
    },href);
    nav.push({href,...box});
    if(href!=='#top' && box.target<box.edge-2) failures.push('Obscured anchor '+href);
  }
  for(const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
  await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
  await page.screenshot({path:path.join(out,`hero-${width}.png`)});
  await page.screenshot({path:path.join(out,`full-${width}.png`),fullPage:true});
  await page.locator('.staff-grid').screenshot({path:path.join(out,`staff-${width}.png`)});
  let axe=null;
  if(process.env.AXE_PATH) {
    await page.addScriptTag({path:process.env.AXE_PATH});
    axe=await page.evaluate(async()=>{
     const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
     return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id),passes:r.passes.length};
    });
    if(axe.violations.length) failures.push('Accessibility violations');
  }
  const thirdPartyRequests=requests.filter(r=>/^https?:/.test(r.url)&&new URL(r.url).origin!==new URL(url).origin);
  if(errors.length) failures.push('Browser console/page errors');
  if(thirdPartyRequests.length) failures.push('Unexpected third-party request on demo load');
  report.screens.push({width,...state,nav,firstFocus,errors,axe,thirdPartyRequests,failures});
  report.failures.push(...failures.map(f=>`${width}: ${f}`));
  await context.close();
 }
 } finally {await browser.close();server.close();}
 fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({url,checks:report.screens.map(s=>({width:s.width,images:s.images.length,errors:s.errors.length,axeViolations:s.axe?.violations.length,failures:s.failures})),report:path.join(out,'browser-audit.json')},null,2));
 assert.equal(report.failures.length,0,report.failures.join('\n'));
})().catch(e=>{server.close();console.error(e.message);process.exitCode=1;});
