const { chromium } = require('C:/Users/dylan/Downloads/study-spot/node_modules/playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch({headless:true});
 try {
  for (const width of [320,390,768,1440]) {
   const page = await browser.newPage({viewport:{width,height:900}, reducedMotion:'reduce'});
   const errors=[]; const external=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(/^https?:/.test(r.url())) external.push(r.url());});
   await page.goto(pathToFileURL(path.join(__dirname,'../index.html')).href);
   assert.equal(await page.locator('main').count(),1,'missing main landmark');
   await page.keyboard.press('Tab');
   assert.equal(await page.locator(':focus').getAttribute('class'),'skip-link');
   await page.keyboard.press('Enter');
   assert.equal(await page.locator(':focus').getAttribute('id'),'main');
   assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
   assert.equal(await page.locator('.tn-active').count(),0,'stale active navigation');
   for(const target of ['#about','#library','#patients','#contact','#book','#top']) {
    await page.evaluate(t=>{location.hash=t;},target);
    await page.waitForFunction(t=>Math.abs(document.querySelector(t).getBoundingClientRect().top)>0,target);
    const rect=await page.locator(target).boundingBox();
    const header=await page.locator('header.top').boundingBox();
    const nav=await page.locator('.topnav').boundingBox();
    const bottom=Math.max(header.y+header.height,nav.y<200 ? nav.y+nav.height : 0);
    assert.ok(rect.y>=bottom-2,`${width} ${target} hidden by sticky headers: ${rect.y} < ${bottom}`);
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} horizontal overflow`);
   for(const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(el=>el.decode());
    assert.ok(await img.evaluate(el=>el.naturalWidth>0),'broken image');
   }
   if(width<540) assert.ok(await page.locator('.doc-card img').first().evaluate(el=>el.getBoundingClientRect().height<400),'mobile portrait stretched');
   assert.deepEqual(errors,[]); assert.deepEqual(external,[],'unsolicited third-party requests');
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.screenshot({path:path.join(__dirname,`audit-${width}.png`),fullPage:true});
   console.log(`PASS ${width}px: anchors, skip link, reduced motion, portraits, overflow, console, no third-party requests`);
   await page.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});