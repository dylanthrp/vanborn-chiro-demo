# Van Born Chiropractic — expert QA report

## Scope and evidence

Audited the existing public demo and the local revision in `C:/Users/dylan/Documents/vanborn-chiro-demo`. Compared content against the clinic's actual doctor/staff, contact/hours, testimonial, services and navigation pages. Inspected supplied staff photographs. Browser coverage uses Chromium at 320, 390, 768 and 1440 CSS-pixel widths, plus automated WCAG A/AA checks where axe-core is supplied.

Evidence: `live-before.json`, `before-full-390.png`, `before-full-1440.png`, final `browser-audit.json`, `source-links.json`, and final screenshots in this directory. Generated files are git-ignored and remain local.

## Findings

## Final local verification result

- **PASS:** four static regression tests (portraits, factual guardrails, care-copy guardrails, no fake booking/data collection).
- **PASS:** independent browser suites at 320, 390, 768 and 1440px: all six image instances load, no horizontal overflow, valid anchors/phone links, usable skip link, clear sticky-header offsets, reduced-motion behavior, no console/page errors and no automatic third-party requests.
- **PASS:** axe-core WCAG A/AA scan reports zero violations at all four widths. Contrast checks include incomplete/manual-review cases; this is not comprehensive accessibility certification.
- **PASS:** all 14 distinct linked clinic resources returned HTTP 200 with non-error page titles. External content and forms are not migrated or clinically validated.
- **PASS:** independent final review in `final-review.json` reports no security concerns or logic errors. Suggestions and production approval gates remain documented.
- **PASS:** `git diff --check`.
- **Deployment:** local working-tree changes only; no commit or push. The existing GitHub Pages URL remains the previous release until an approved publication.

All findings below have been addressed in the local demo. Production authorization, reuse permissions, clinical approval, current hours and any future booking backend remain launch gates—not claims of completion.

### Earlier-release findings

| ID | Severity | Category | Finding in the earlier public demo |
|---|---|---|---|
| 1 | High | Functional / privacy | Form displayed “Request received” without sending anything; requested contact and health information. |
| 2 | High | Content | Invented/paraphrased testimonials presented as exact quotes; star ratings added without source ratings; inappropriate clinical efficacy implications. |
| 3 | High | Content | Wrong founder in structured data; inconsistent 1971/1968 history; unsupported sibling, founder education, specialty and service promises. |
| 4 | Medium | Functional | Eight library cards linked to `#`; Home linked to missing `#top`; Patients did not preserve original patient resources. |
| 5 | Medium | Functional | Open/closed indicator used visitor clock, ignored alternating Saturdays, and always said next Monday when closed. |
| 6 | Medium | Accessibility | Low-contrast small text and mobile Call label; missing main landmark/skip navigation; sticky header obscured anchor destination. |
| 7 | Medium | Representation | Public portfolio concept lacked a prominent demo label/noindex and resembled an authorized clinical booking site. |
| 8 | Low | Visual | Staff cards used empty avatars; doctor-card portrait proportions and mobile readability needed review. |
| 9 | Medium | Privacy / reliability | Embedded third-party map loaded on the demo rather than on an intentional directions click. |

## Reproduction details

### 1 — Appointment form
- URL: public demo `#book`.
- Reproduce: inspect `form[onsubmit]` or complete its required fields and submit.
- Expected: confirmed delivery to a configured clinic-owned system, or an explicit demo-only notice.
- Actual: inline code prevented submission, hid the form and showed a confirmation. No delivery operation existed. No real patient data was used or sent during this audit.

### 2–3 — Content fidelity
- URL: public demo `#about`, testimonials, title/meta and JSON-LD.
- Reproduce: compare wording/attribution to `https://www.vanbornchiropractic.com/page/doctor.html` and `/page/1testimonials.html`.
- Expected: exact attributed excerpts and only supported biographical claims; no invented stars or medical outcome guarantees.
- Actual: synthesized quotations, inferred relationships, wrong founder metadata and inconsistent dates. The source itself contains medically questionable claims; preservation of information does not justify amplifying those claims.

### 4 — Navigation
- Reproduce: click any old library card; inspect Home destination.
- Expected: a real relevant resource and an existing top anchor.
- Actual: library clicks returned to page top and Home referenced a nonexistent ID. Original clinic menus also had dropdown destinations that were not represented by four decorative anchor tabs alone.

### 5 — Hours
- Reproduce: inspect old status script on any closed weekday or second/fourth Saturday; use a browser outside Michigan's timezone.
- Expected: accurate, source-confirmed availability or a neutral hours link.
- Actual: generic Monday reopening, incorrect Saturday calculation, visitor-local time. Source contact page publishes Mon/Wed/Thu/Fri 9–6 and 1st/3rd/5th Saturdays 9–12, Tuesday/Sunday closed. Call to confirm holidays/current hours.

### 6 — Accessibility and responsive interaction
- Reproduce: run `tests/expert-audit.cjs` with axe-core, tab from initial page load, then click About Us.
- Expected: visible keyboard focus, a working skip link, readable contrast and unobscured section destination.
- Actual: automated contrast violations, no skip/main landmark, sticky navigation overlapping content.

### 7–9 — Demo clarity, portraits and external content
- Reproduce: inspect hero/footer, scroll to staff and inspect network requests.
- Expected: clearly identified portfolio demo, supplied portraits with alt text and stable dimensions, intentional external navigation.
- Actual: live clinic implication, empty avatars and third-party map requests. Baseline browser console errors were not a reliable indicator of these defects: most failures produced no JS errors.

## Verification commands

```sh
node --test tests/portraits.cjs tests/audit.cjs
AXE_PATH=/path/to/axe-core/axe.min.js node tests/expert-audit.cjs
node tests/source-links.cjs
git diff --check
```

`expert-audit.cjs` starts and closes an isolated local HTTP server. It accepts `PLAYWRIGHT_PATH` and `AUDIT_URL`; without the latter it tests the local working tree. Source-link checks visit resources but do not submit external forms. Automated accessibility checks are not a legal compliance certification or a substitute for assistive-technology testing.

## Launch limits

See `launch-checklist.md`. Owner authorization, current content/hours approval, media/testimonial permissions, healthcare privacy review and a real booking integration remain separate from this QA pass. The old proposal is marked on hold because its commercial and factual claims require revision. No commit, push or live publication is authorized by this report.
