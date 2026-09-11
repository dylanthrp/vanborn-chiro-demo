# Van Born local landing pages

These pages mirror content published on the original `vanbornchiropractic.com`
site, reformatted to match the demo's cream/green styling. Every page carries:

- the same `<head>` chrome (meta description, noindex, demo notice, JSON-LD)
- the same skip-link, header, top nav, footer
- a "Source" link back to the original page
- a "results vary" footnote where medical claims are paraphrased

Because they live alongside `index.html`, internal navigation can use relative
links and a `data-page` attribute on `<body>` lights up the active nav tab.

## Page map

| Local file | Replaces | Type |
|---|---|---|
| `meet-the-doctors.html` | `/page/doctor.html` | Bio cards |
| `patient-stories.html` | `/page/1testimonials.html` | Quote cards, masonry |
| `services.html` | `/page/services.html` | Service card grid |
| `pediatric.html` | `/page/pediatric.html` | Audience landing |
| `sports-performance.html` | `/page/sports-and-chiropractic.html` | Audience landing |
| `patient-resources.html` | `/page/npf.html` | Form download list |
| `library-back.html` | `/articles/back/` | Article index (filtered) |
| `library-neck.html` | `/articles/neck/` | Article index (filtered) |
| `library-sciatica.html` | `/articles/sciatica/` | Article index (filtered) |
| `library-carpal.html` | `/articles/carpal+tunnel/` | Article index (filtered) |
| `library-joints.html` | `/articles/joints/` | Article index (filtered) |
| `library-foot.html` | `/articles/foot/` | Article index (filtered) |

## Construction

Each page reuses `partials/chrome.html` for header/footer. Build the static
files by copying `index.html`, replacing the content `<section>`s, and adding
`<body data-page="doctors">` (or whatever) so the active nav tab can be
highlighted.

A `tests/landing-pages.cjs` script verifies:

- every linked URL in `index.html` resolves to a local file (no outbound
  `vanbornchiropractic.com` references)
- every local page includes the demo notice + noindex + skip link + main landmark
- the active nav tab matches the page

## What is filtered vs kept

- **Kept:** musculoskeletal framing, real patient quotes (verbatim), doctor/staff
  bios, services list, hours, contact info, form download list.
- **Filtered:** article titles mentioning asthma, allergies, ear infections,
  autism, ADHD, colic, bedwetting, cancer, Crohn's, lupus, MS, glaucoma,
  pregnancy-breech-positioning claims. Each library page keeps a one-line note
  that those topics exist on the original site and links there.

Filter rationale: these claims are not supported by high-quality evidence for
chiropractic care and would expose the demo to reputational and regulatory risk
if presented as authoritative. Real patient experience language is preserved.
