# Domain Routing Guide — Making Your New Site Live on `vanbornchiro.com`

> Reference document for after the clinic says yes. Plain-English steps for the three most common registrars. If yours isn't listed, the Cloudflare step is the same regardless.

**You will need:**

1. **Domain name login** (e.g., GoDaddy, Namecheap, Google Domains, Cloudflare Registrar). You, not Dylan, should have full access — do **not** share passwords over email/text. Use a one-time login link or screen-share.
2. **~10 minutes**
3. **Coffee**

---

## Step 0 — Buy the domain (if you don't already own one)

If the clinic already owns `vanbornchiropractic.com` and wants to keep it, skip to Step 1.

Recommended: **`vanbornchiro.com`** — short, professional, easy to say over the phone. Alternatives: `vanbornchi.com`, `drpethtel.com`. Buy at any registrar:
- Cloudflare Registrar (cheapest, no markup)
- Namecheap (~$12/yr for `.com`)
- GoDaddy (~$20/yr but most familiar UI)
- Google Domains

Dylan can register the domain on your behalf if you give verbal approval — invoice the registration fee at cost. **The domain is registered in YOUR name with YOUR email as registrant contact.** Dylan never owns your domain.

---

## Step 1 — I prepare the live site on my end (~5 minutes)

I'll deploy the approved version of the site to a Cloudflare Pages account in your name. You'll get an email from Cloudflare confirming the new project exists.

The deployment gives me three nameservers like:

```
<yourname>.ns1.cloudflare.com
<yourname>.ns2.cloudflare.com
<yourname>.ns3.cloudflare.com
```

**Write those down — you'll need them in Step 2.**

---

## Step 2 — Point your domain at Cloudflare (where the site lives)

Pick the section that matches your registrar.

### If you use GoDaddy

1. Log in at https://dpg.godaddy.com/
2. Go to **My Products → Domains → vanbornchiro.com → DNS**
3. Scroll to **Nameservers** → click **Change** → choose **Custom**
4. Paste the three Cloudflare nameservers from Step 1
5. Save. GoDaddy warns "this may take up to 24 hours" — usually it's about 30 minutes.

### If you use Namecheap

1. Log in at https://www.namecheap.com/myaccount/
2. Click **Domain List → vanbornchiro.com → Manage**
3. Left sidebar → **Nameservers** → set to **Custom DNS**
4. Paste the three Cloudflare nameservers
5. Save (green check)

### If you use Google Domains

1. Log in at https://domains.google.com/
2. Click **vanbornchiro.com → DNS → Name servers → Use custom name servers**
3. Paste the three Cloudflare nameservers
4. Save

### If you don't remember (or have a less common registrar)

1. Log in to wherever you bought/manage the domain
2. Find the **Nameservers** or **DNS Settings** for that domain
3. Replace whatever nameservers are there with the three from Step 1

---

## Step 3 — Wait for propagation (5 min to 24 hours)

Once you've changed the nameservers, the world has to notice. Most registrars show a small icon or status indicator when propagation completes. You can also check at https://dnschecker.org — type `vanbornchiro.com` and watch the NS row go from your old registrar's name to `*.ns1.cloudflare.com`.

When the NS row says Cloudflare everywhere, your domain is officially live on the new site. Anyone typing `vanbornchiro.com` in a browser will see the demo we built.

---

## Step 4 — Set up email forwarding (optional but recommended)

Once Cloudflare is in charge of your DNS, you can set up professional email forwarding in Cloudflare's dashboard:

1. Log in to Cloudflare → pick `vanbornchiro.com`
2. **Email → Email Routing → Add rule**
3. Forward `info@vanbornchiro.com` to your existing personal inbox
4. Forward `appointments@vanbornchiro.com` to your receptionist's email

**Cost: free for up to 5 forwarders.**

You keep using your existing email address (Gmail, Outlook, whatever); the clinic address just routes into it. Replies still come from your real address.

---

## What stays the same

- Your existing email (clinic staff continues to use whatever they use today)
- Your existing phone number
- Your existing patient scheduling system
- The clinic's physical location
- The clinic's name and branding

## What changes

- Visitors typing `vanbornchiro.com` see the new site
- Visitors who had the old site bookmarked continue to see the old site unless you also redirect `vanbornchiropractic.com` (optional, see below)

---

## Optional — keep the old domain working too

If the clinic has been online for years at `vanbornchiropractic.com`, you'll want visitors using the old address to reach the new site. Two options:

**Option A (recommended): redirect the old domain to the new one**

1. In Cloudflare, add `vanbornchiropractic.com` as a second domain
2. Set up a 301 redirect from `vanbornchiropractic.com/*` to `https://vanbornchiro.com/$1`

**Option B: just keep both**

Have the new site at `vanbornchiro.com` and let the old one keep its current site. After 12 months, set up the redirect.

---

## Timeline

| Step | Who | Time | When |
|---|---|---|---|
| Buy / confirm domain ownership | You | 10 min | Before green-light |
| Deploy site to Cloudflare Pages | Dylan | 5 min | After green-light |
| Update nameservers at registrar | You | 10 min | Within 1 day of green-light |
| DNS propagation | Internet | 30 min – 24 hours | Automatic |
| Email forwarding (optional) | Either | 10 min | After propagation |
| Old-domain redirect (optional) | Dylan | 15 min | Anytime |

---

## Common questions

**"Will my email stop working?"**
No. Email is independent of website hosting. Your email continues to work unless you specifically change your MX records (you won't).

**"What if I want to switch back?"**
Just point your nameservers back at your old registrar. Nothing on your end changes permanently.

**"Do I own everything?"**
Yes. The domain is in your name. The Cloudflare account is in your name. The repository is in your GitHub account. The whole stack can be handed to any other developer tomorrow.

**"What's Dylan's role after launch?"**
Optional. The $50/month covers hosting, security patches, content edits you request ("change the phone number," "add Dr. So-and-so to the team page"), and broken-link checks. You can cancel any time and run it yourself.

---

*Questions? Text or call Dylan — (your number here) — or email dylanthrp@gmail.com.*
