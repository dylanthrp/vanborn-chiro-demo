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
  assert.match(html, /Unsolicited portfolio demo/);
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
  assert.match(html, /This demo does not collect/);
  const phones = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(m => m[1]);
  assert.ok(phones.length > 2);
  assert.ok(phones.every(p => p === 'tel:+13132911060'));
  assert.equal((html.match(/\+\*\*\*\*/g) || []).length, 0, 'no masked phones');
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
