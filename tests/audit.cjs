const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');

test('care copy avoids unsupported guarantees and free offers', () => {
  assert.ok(!/Free phone consultation|slow progression|free up without surgery|stay out of pain|exactly what your first visit|typically a series/i.test(html));
});

test('public demo content is attributed and avoids invented clinical promises', () => {
  assert.ok(!/1971|aggregateRating|og\.png|Yahoo client rating|pullquote">|His children|school their father|specialist<|long-tenured|★★★★★|asthma|autism|Open now|new Date\(/i.test(html), 'unsupported facts or live status remain');
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /Website preview/);
  assert.match(html, /"foundingDate": "1968"/);
  assert.match(html, /"name": "Donald L. Pethtel"/);
  assert.match(html, /1st, 3rd and 5th Saturdays/);
  assert.match(html, /Results vary/);
  assert.match(html, /Jeremy Gordon/);
  assert.match(html, /Christina Marger/);
  assert.match(html, /Domenic Paesani/);
  assert.match(html, /patient-resources\.html/);
  assert.match(html, /services\.html/);
  assert.match(html, /patient-stories\.html/);
  assert.match(html, /https:\/\/www\.vanbornchiropractic\.com\/page\/doctor\.html/);
  assert.doesNotMatch(html, /<iframe/);
});

test('demo appointment path collects no data and makes no submission promise', () => {
  assert.doesNotMatch(html, /<form\b|Request received|Book online|<span>Book<\/span>/i);
  assert.match(html, /Appointment information/);
  assert.match(html, /Appointments cannot be requested or confirmed/);
  const phones = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(m => m[1]);
  assert.ok(phones.length > 2);
  assert.ok(phones.every(p => p === 'tel:+' + '1' + '313' + '291' + '1060'));
  assert.equal((html.match(/\+\*\*\*\*/g) || []).length, 0, 'no masked phones');
});

test('patient presentation is clear, accurate and never substitutes for a clinic workflow', () => {
  const root = require('node:path').join(__dirname, '..');
  for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
    const page = fs.readFileSync(require('node:path').join(root,file), 'utf8');
    assert.match(page, /Website preview/ , file);
    assert.doesNotMatch(page, /Portfolio demo|Unsolicited portfolio demo/i, file);
    assert.match(page, /not the official clinic website/i, file);
    assert.match(page, /name="robots" content="noindex, nofollow"/, file);
    for (const [,phone] of page.matchAll(/href="(tel:[^"]+)"/g)) {
      assert.equal(phone, 'tel:+' + '1' + '313' + '291' + '1060', file);
    }
  }
  assert.doesNotMatch(html, /first ten minutes|No full-body X-rays|no contracts|written summary|Nothing on this site tells anyone|Every page is served over HTTPS/);
  assert.match(html, /hosting provider/i);
  assert.match(html, /GitHub Pages/);
});

test('audience pages offer questions, not unsupported medical or performance promises', () => {
  const root = require('node:path').join(__dirname, '..');
  for (const file of ['pediatric.html','sports-performance.html']) {
    const page = fs.readFileSync(require('node:path').join(root,file),'utf8');
    assert.doesNotMatch(page, /14\.8%|safely, with no discomfort|Studies have proven|recover quickly and completely|best way to ensure|should be included as part/);
    assert.match(page, /benefits and risks/);
  }
});

test('every library page is linked from the homepage', () => {
  for (const slug of ['back','neck','sciatica','carpal','joints','foot']) {
    assert.match(html, new RegExp(`library-${slug}\\.html`), `missing link to library-${slug}.html`);
  }
});

test('every audience landing page is linked from the homepage', () => {
  for (const slug of ['meet-the-doctors','patient-stories','services','pediatric','sports-performance','patient-resources']) {
    assert.match(html, new RegExp(`${slug}\\.html`), `missing link to ${slug}.html`);
  }
});
