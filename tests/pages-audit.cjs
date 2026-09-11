// Browser audit. Resolves playwright from C:/Users/dylan/Downloads/study-spot/node_modules/playwright.
// AXE_PATH=.../axe.min.js enables WCAG A/AA checks.
// AUDIT_URL=https://... overrides the served homepage (use for release checks).
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/dylan/Downloads/study-spot/node_modules/playwright')); }
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'qa');
fs.mkdirSync(out, {recursive:true});

const MIME = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server = http.createServer((req,res)=>{
  const p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const f = path.resolve(root, '.' + (p === '/' ? '/index.html' : p));
  if (!f.startsWith(root)) {res.writeHead(403).end();return;}
  try {
    res.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream');
    res.setHeader('Connection', 'close');
    res.end(fs.readFileSync(f));
  } catch {res.writeHead(404).end();}
});

const PAGES = [
  ['index.html', ['donald-portrait', 'renee1', 'jane-carroll', 'IMG_2608-200', 'Loretta-Klapko']],
  ['meet-the-doctors.html', ['renee1', 'donald-portrait', 'jane-carroll', 'IMG_2608-200', 'Loretta-Klapko']],
  ['services.html', []],
  ['pediatric.html', []],
  ['sports-performance.html', []],
  ['patient-resources.html', []],
  ['patient-stories.html', []],
  ['library-back.html', []],
  ['library-neck.html', []],
  ['library-sciatica.html', []],
  ['library-carpal.html', []],
  ['library-joints.html', []],
  ['library-foot.html', []],
];

(async()=>{
  await new Promise(r => server.listen(0,'127.0.0.1',r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const report = {testedAt: new Date().toISOString(), pages: [], failures: []};
  try {
    for (const [pagePath, expectedImageStems] of PAGES) {
      const url = base + '/' + pagePath;
      const ctx = await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
      const page = await ctx.newPage();
      const errors = [];
      const requests = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('request', r => requests.push(r.url()));
      const response = await page.goto(url, {waitUntil:'domcontentloaded'});
      await page.waitForLoadState('load').catch(()=>{});
      for (const img of await page.locator('img').all()) await img.scrollIntoViewIfNeeded();
      await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(()=>{}))));
      const state = await page.evaluate(() => ({
        title: document.title,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        images: [...document.images].map(i => ({src:i.getAttribute('src')||'', loaded: i.complete && i.naturalWidth > 0})),
        phoneLinks: [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href')),
        maskedPhoneRefs: [...document.querySelectorAll('a[href*="****"]')].length,
        forms: document.querySelectorAll('form,input,textarea').length,
        main: document.querySelectorAll('main').length,
        noindex: (document.querySelector('meta[name="robots"]')?.content || '').includes('noindex'),
        demoBanner: !!document.querySelector('.demo-banner'),
        brandImgLoaded: (() => { const i = document.querySelector('.brand .mark'); return i ? i.complete && i.naturalWidth > 0 : null; })(),
        headerIcons: document.querySelectorAll('.header-icons .hi').length,
        mobileBar: document.querySelectorAll('.mobile-bar').length,
        thirdPartyOnLoad: [],  // filled below
      }));
      const thirdPartyOnLoad = requests.filter(u => /^https?:/.test(u) && new URL(u).origin !== new URL(url).origin && !/vanbornchiropractic\.com/.test(u));
      const failures = [];
      if (response.status() !== 200) failures.push('HTTP ' + response.status());
      if (state.overflow > 0) failures.push('Horizontal overflow');
      if (state.forms > 0) failures.push('Form/input elements present');
      if (state.main !== 1) failures.push('Missing main landmark');
      if (!state.noindex) failures.push('Missing noindex');
      if (!state.demoBanner) failures.push('Missing demo banner');
      if (state.brandImgLoaded === false) failures.push('Brand mark failed to load');
      if (state.mobileBar > 0) failures.push('Mobile bar still present');
      if (state.maskedPhoneRefs > 0) failures.push('Masked phone refs present');
      if (state.phoneLinks.some(h => h !== 'tel:+13132911060')) failures.push('Non-canonical phone ref');
      if (thirdPartyOnLoad.length) failures.push('Third-party request on load');
      if (errors.length) failures.push('Browser console errors');
      for (const stem of expectedImageStems) {
        if (!state.images.some(i => i.src.includes(stem) && i.loaded)) failures.push(`Expected image missing or unloaded: ${stem}`);
      }
      // Skip-link focus check
      await page.goto(url, {waitUntil:'domcontentloaded'});
      await page.keyboard.press('Tab');
      const firstFocus = await page.evaluate(() => ({text: (document.activeElement.textContent || '').trim()}));
      if (!/skip/i.test(firstFocus.text)) failures.push('Skip link not first focus');
      report.pages.push({url: pagePath, title: state.title, overflow: state.overflow, images: state.images.length, phones: state.phoneLinks.length, headerIcons: state.headerIcons, mobileBar: state.mobileBar, errors: errors.length, failures});
      if (failures.length) report.failures.push(`${pagePath}: ${failures.join('; ')}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  fs.writeFileSync(path.join(out, 'pages-audit.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({pages: report.pages.length, failures: report.failures.length, sample: report.pages.slice(0,3)}, null, 2));
  if (report.failures.length) {
    console.error('FAILURES:\n' + report.failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('All pages passed');
  }
})().catch(e => { server.close(); console.error(e.message); process.exitCode = 1; });
