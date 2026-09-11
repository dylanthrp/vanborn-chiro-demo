# Van Born Chiropractic portfolio demo

Static HTML/CSS/JavaScript concept. Not an authorized clinic website or patient intake service.

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

The audit starts a temporary loopback HTTP server, tests four viewport widths, records screenshots/results under `qa/`, and closes the server. To verify an approved release rather than local files, set `AUDIT_URL` to the deployed URL. Source-link checks are read-only; do not submit test messages to the actual clinic.

## Content and launch review

- Primary sources: [doctor/staff](https://www.vanbornchiropractic.com/page/doctor.html), [contact/hours](https://www.vanbornchiropractic.com/page/contact.html), [testimonials](https://www.vanbornchiropractic.com/page/1testimonials.html), [services](https://www.vanbornchiropractic.com/page/services.html).
- Staff images supplied by Dylan, with identities matched against the clinic's labeled staff page.
- Original library/forms resources remain external links; their content has not been migrated or medically validated.
- See `qa/report.md` and `qa/launch-checklist.md` for findings and launch gates.
- `one-page-proposal.md` is on hold for factual/commercial revision; do not send it unchanged.

Browser tests cannot confirm owner authorization, clinical accuracy, privacy compliance, actual phone-call connection, or third-party form delivery. Public source material still requires appropriate reuse permission. No real booking backend is configured.
