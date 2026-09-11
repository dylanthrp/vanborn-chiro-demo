# Van Born Chiropractic Clinic, P.C. — Website Proposal

**To:** Van Born Chiropractic Clinic, P.C.
**From:** Dylan Thorpe, UM-Dearborn mechanical engineering student
**Re:** A new website built on top of your own published content
**Date:** September 2026
**Live demo:** https://dylanthrp.github.io/vanborn-chiro-demo/

---

## The honest problem

Van Born has been serving Dearborn Heights since 1968. That's the kind of track record that earns trust before a prospect ever visits. The current public site makes that trust harder to extend online. It's not mobile-friendly. Click-to-call doesn't work the way people expect on a phone. The wellness library is there, but the homepage doesn't surface it. Every year a few new patients find you in spite of the site, when they could be finding you because of it.

I'm not going to tell you it'll triple your new-patient count. I don't know that, and neither does anyone who hasn't measured it for your clinic. What I do know is that the bar in your category is reachable in a week of focused work, and I've already built the work for you to see.

---

## What I built

I spent several hours with your published content and put together a complete, mobile-first site using your own:

**Doctor bios** for Dr. Renee I. Pethtel (featured on the homepage) and Dr. Donald G. Pethtel, drawn from your staff page
- **Real patient testimonials** with names and roles, taken verbatim from your testimonial page
- **Your wellness library**, organized by body area
- **Your patient forms** linked to your actual PDFs
- **Your hours, address, phone** — no placeholders

The demo lives at **https://dylanthrp.github.io/vanborn-chiro-demo/**. You can open it on your phone right now and see what your patients will see.

| Page | What it does |
|---|---|
| Home | Tap-to-call in the header, care topics, your doctors, published testimonials, hours, map |
| About Us | Dr. Renee leads the page; full bios for both doctors; front-desk and massage staff |
| Patient stories | Fourteen published testimonials in their own words |
| Services | Six service cards based on what your site lists |
| Pediatric & prenatal / Sports & performance | Standalone pages mirroring your patient-education pages |
| Wellness Library — back / neck / sciatica / carpal tunnel / joints / foot | Six index pages drawn from your case-study library |
| Patient resources | Your new-patient forms, HIPAA policy, disability indexes (PDFs verified) |

---

## What it would cost

|  | Amount |
|---|---|
| **One-time build (50% off my launch price)** | **$1,250** |
| Optional hosting + maintenance | $50/month, cancel anytime |

The setup price is below my normal launch number because this would be my first medical-practice deployment and I'd rather earn the relationship than maximize the first contract. The monthly is optional and covers hosting, security updates, content edits, and link checks.

**What I'd need from you:**

1. A 30-minute meeting to walk through what's there, what to keep, what to change
2. Approval of any wording you want edited before it goes live
3. Your real domain registrar login (or I'll help you register one in your name — $12/year)

**What I do after you say yes:**

1. We do one more 30-minute walkthrough to verify the site matches your preferences
2. I register `vanbornchiro.com` (or transfer your existing one) into your name
3. I set up Cloudflare DNS to point your domain at the new site (about 10 minutes)
4. I push the live version to your real domain — same look, your real URL
5. Total: roughly 5–7 business days from green-light

**What's not in scope** (call me if you want any of these later, priced separately):

- Online booking integration with your scheduling software
- A blog with monthly posts
- Paid search / Google Ads management

**What I'll never do without your written OK:**

- Use a patient's testimonial or photo in a way they didn't agree to
- Change your hours, address or phone without you telling me to
- Put anything medical on the site that isn't from your own published pages

---

## Why I'd be honest about my experience

I'm a mechanical engineering student at UM-Dearborn, not a web-design firm. I won't pretend otherwise. What I will say:

- I shipped this concept site in a few sessions using the same tools and methods I'd use on a paid engagement
- I'll write every line of HTML, CSS, and JavaScript myself — no AI-generated filler, no copy-and-pasted templates
- I'll hand off everything at the end: a private GitHub repository in your name, every asset, every account credential
- You own the work outright the moment I send the final invoice

---

## Security, privacy, and ownership — what I would (and would never) do

You'd hear "data privacy" in any vendor pitch. Here's the actual list, in plain English, that I can back up:

**What I never do**

- I never collect patient information through this site. There is no form that asks for a name, birth date, insurance, ID, address, or health history. The "Speak with the clinic" and "Appointment information" sections all link back to your published phone number — the human-to-human channel you already run.
- I never upload patient forms to a server. The "Patient forms →" links open PDFs from your existing website. Nothing is copied, nothing is logged, no one in the middle sees the traffic.
- I never use patient testimonials in a way that wasn't already published by the clinic on the existing site, in the same context, with names and details you already approved.
- I never change your hours, address, phone, doctor names, or service descriptions without you telling me to in writing (text or email counts).
- I never sell, rent, share, or hand over anything — phone numbers from a contact form, traffic logs, anything — to a third party. There are no third-party trackers, no Google Analytics, no ad pixels, no Facebook pixel, no chat widgets, no AI tools reading content on the page.

**What I do**

- The site uses **HTTPS only** (a free certificate from Let's Encrypt, managed through Cloudflare). Every page is encrypted in transit. Browsers show the padlock.
- The site is hosted on a Cloudflare account I create in your name. Cloudflare's edge blocks the most common attacks (DDoS, credential stuffing, known-bad bots) before a single byte reaches your content. You get a Cloudflare login with full admin access from day one.
- The site is a **static site**: HTML, CSS, and images that load from Cloudflare's global edge network. There is no database, no login system, no admin panel for a hacker to find. The attack surface is small by design.
- Forms, if we add any in the future, route to **your email inbox** (form-to-email using Formspree or Netlify Forms, sitting on Cloudflare's security layer). Not to a database I control.
- I keep a private GitHub repository in your name with every line of code, every image, every asset. On the off chance I'm hit by a bus in 2027, you can hand the repository to any web developer and they can keep the site running. **Full code escrow, free, built in.**
- DNS, hosting, certificate renewals — all set to renew automatically. The site has been known to run unattended for years.

**What I'd ask you to confirm before any launch involving a real intake form**

- Whether the clinic has a HIPAA-aware workflow you'd like the form to feed into (probably your existing electronic health records vendor).
- Whether the practice has a Business Associate Agreement (BAA) on file with any tool that touches patient data — Formspree's HIPAA plan, Google's GSuite BAA, Microsoft 365's BAA, etc. If we end up needing one, it's a line item I'll flag in writing before any code is written.
- A contact at your malpractice insurer in case they have specific website language requirements (many do — usually around testimonials, "results" claims, and BEFORE/AFTER imagery).

**What I'll have in writing before launch**

- A short "What's running where" memo: which registrar, which DNS provider, which hosting platform, which code repository, who owns each account, where the credentials live, how to transfer it all out in under an hour if you ever want to leave.
- A list of every third-party service the site talks to (currently: GitHub Pages or Cloudflare Pages for hosting, plus Cloudflare for DNS. That's it.).
- A clear ownership statement: every account is in your name. I hold no admin keys you can't revoke.

I'm a mechanical engineering student, not a lawyer, and I'd never draft something legal-sounding for a medical practice. What I will do is **put the simple, verifiable commitments in writing**, and own them in writing, in plain English.

---

## The next step

I'm not going to push. Three options, take whichever fits:

1. **Look at the live demo** on your own schedule: https://dylanthrp.github.io/vanborn-chiro-demo/
2. **Email me a question** at **dylanthrp@gmail.com**
3. **Call or text me** to set up a 20-minute in-person walkthrough at the clinic: <mark style="background-color: #fff3a8; padding: 2px 4px; border-radius: 3px;">**(313) 555-0100** *[PLACEHOLDER — replace with your cell number before printing]*</mark>

Thanks for your time.

— Dylan Thorpe
UM-Dearborn · Dearborn, MI
dylanthrp@gmail.com
