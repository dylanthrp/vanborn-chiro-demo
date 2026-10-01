# Van Born Chiropractic website preview

Static HTML/CSS/JavaScript design preview. Not an authorized clinic website or patient intake service.

- **previewURL:** https://dylanthrp.github.io/vanborn-chiro-demo/
- **officialClinicURL:** https://www.vanbornchiropractic.com/

The preview retains `noindex, nofollow` and a readable disclosure on every page. Publishing the preview is not approval to launch as the clinic’s official website.

## Preview locally

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/. No build step is required.

## Repeatable QA

```sh
node --test tests/portraits.cjs tests/audit.cjs
node tests/source-links.cjs
node tests/expert-audit.cjs
git diff --check
```

The browser audit requires Playwright and installed Chromium. It resolves a local `playwright` module first, then `PLAYWRIGHT_PATH` (or this workstation's existing Study Spot dependency). `AXE_PATH` optionally points to axe-core's `axe.min.js` for WCAG A/AA checks. Both tools are development-only; the website has no dependency on them.

```sh
PLAYWRIGHT_PATH=/absolute/path/to/node_modules/playwright \
AXE_PATH=/absolute/path/to/node_modules/axe-core/axe.min.js \
node tests/expert-audit.cjs
```

The browser audit starts a temporary loopback HTTP server, exercises all 13 pages at 320/390/768/1440 pixels, then repeats reading/FAQ checks without JavaScript. It checks actual navigation, compact sticky mobile tabs, skip links, FAQ keyboard behavior, local-only library search (case/whitespace, empty result, reset/focus), anchors, images, phone links, console errors and network requests. Optional axe checks run on every page at every width. Screenshots/results go to a unique `.hermes/vanborn-polish/audit-*` directory; `AUDIT_OUTPUT` can select another location. Existing QA screenshots are never overwritten by these commands.

To verify the public preview after publication:

```sh
AUDIT_URL=https://dylanthrp.github.io/vanborn-chiro-demo/ node tests/expert-audit.cjs
```

Source-link checks cover clinic HTML/PDF links across all root pages and are read-only; do not submit test messages to the actual clinic.

## Patient-facing improvements

Native FAQs answer scheduling, preparation, fees/insurance, hours, privacy and medical-information questions. The six existing library indexes have local-only title search and topic navigation. Without JavaScript the full lists remain readable and the unused search controls stay hidden. No search terms are stored or transmitted by site code.

Design ideas were taken from [DearDoc](https://getdeardoc.com/blog/medical-practice-website-design) and [Officite](https://www.officite.com/9-doctor-website-design-examples-that-attract-patients/): clear doctor introductions, mobile navigation, useful education/FAQs and direct next steps. Chat, fake scheduling, patient portals, compliance badges and unsupported medical promises were deliberately excluded.

Privacy copy distinguishes site behavior from hosting: GitHub Pages may process technical requests, public HTTPS does not imply that local HTTP is encrypted, and external services apply their own policies.

## Content and launch review

- Primary sources: [doctor/staff](https://www.vanbornchiropractic.com/page/doctor.html), [contact/hours](https://www.vanbornchiropractic.com/page/contact.html), [testimonials](https://www.vanbornchiropractic.com/page/1testimonials.html), [services](https://www.vanbornchiropractic.com/page/services.html).
- Staff images supplied by Dylan, with identities matched against the clinic's labeled staff page.
- Original library/forms resources remain external links; their content has not been migrated or medically validated.
- See `qa/report.md` and `qa/launch-checklist.md` for findings and launch gates.
- `one-page-proposal.md` is on hold for factual/commercial revision; do not send it unchanged.

Browser tests cannot confirm owner authorization, clinical accuracy, privacy compliance, actual phone-call connection, or third-party form delivery. Public source material still requires appropriate reuse permission. No real booking backend is configured.
