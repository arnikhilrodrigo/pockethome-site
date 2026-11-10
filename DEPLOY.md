# Deploying this site

Handover notes. This repo **is** the site — plain static files, no build step, no
framework, no dependencies. Whatever is in the repository root is what gets served.

The target domain is **pockethome.nichekala.in**.

---

## Read this first

As of **11 Nov 2026**, `pockethome.nichekala.in` resolves to **Firebase Hosting**:

```
pockethome.nichekala.in  CNAME  pockethomenichekala-62d62.web.app
                         A      199.36.158.100
```

It is serving an **older build** of this same page — different hero image, no
Eight Essentials section, no project brochures, old contact details. So this is a
**replacement**, not a first deploy.

Nobody here knows which Firebase plan that project is on, or what deployed to it.
**Please check both before deploying** — see the quota warning below, it matters.

A current build is published for review at:
<https://arnikhilrodrigo.github.io/pockethome-site/>

---

## Option A — Firebase Hosting (keeps the current DNS)

Nothing to change in DNS. `firebase.json` in this repo is ready to go.

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting --project pockethomenichekala-62d62
```

Confirm the project ID first — it was inferred from the DNS record above, not from
any account we can see.

### ⚠️ Check the plan before you do this

Firebase Hosting's free **Spark** plan allows **360 MB of transfer per day**, and
when that runs out **Hosting stops serving** until the quota resets. The site is
unusually heavy for a landing page:

| | |
|---|---|
| Project renders | ~8.4 MB |
| Project brochures (8 PDFs) | ~23 MB |
| Largest single PDF | 4.8 MB |

One engaged visitor who scrolls the portfolio and downloads two brochures uses
roughly **10–12 MB**. On Spark that is about **30 visitors a day** before the site
goes dark — and this page exists to be shared on Instagram and to give brochures
away, so that traffic pattern is the intended one, not the worst case.

**If the project is on Spark, either move it to Blaze (pay-as-you-go) or host on
GitHub Pages instead.** The cache headers in `firebase.json` help repeat visitors
but do nothing for first-time ones.

Current quotas: <https://firebase.google.com/pricing>

---

## Option B — GitHub Pages (recommended)

GitHub Pages allows **100 GB/month** (~3.3 GB/day), roughly 10× the headroom, and
it degrades rather than switching off. The sister site
`knowyourhome.nichekala.in` is already hosted this way, so both would match.

1. **DNS** — in GoDaddy, change the `pockethome` CNAME:

   ```
   pockethome   CNAME   arnikhilrodrigo.github.io
   ```

   (replacing `pockethomenichekala-62d62.web.app`)

2. **Custom domain** — rename `CNAME.example` to `CNAME` and push:

   ```bash
   git mv CNAME.example CNAME
   git commit -m "Point Pages at pockethome.nichekala.in"
   git push origin main
   ```

   > Do not add `CNAME` before the DNS change. With it present, Pages redirects
   > the `github.io` URL to the custom domain — which currently lands on Firebase,
   > making the site unreachable at both addresses. We hit exactly this.

3. **Enable HTTPS** once DNS resolves:

   ```bash
   gh api -X PUT repos/arnikhilrodrigo/pockethome-site/pages -F https_enforced=true
   ```

Pages rebuilds in about a minute. Check status with:

```bash
gh api repos/arnikhilrodrigo/pockethome-site/pages/builds/latest
```

Limits: <https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>

---

## Whichever route you choose

- **Pick one.** Two hosts serving one domain is how the current drift happened —
  an old build sitting on Firebase while the source moved on.
- If something **automatically deploys** to that Firebase project, disable it or
  repoint it here, otherwise it will overwrite this build later.

---

## Running it locally

```bash
python serve.py          # http://localhost:5520
```

Use this rather than `python -m http.server`. The built-in server sends
`Last-Modified` and answers `304 Not Modified`, so browsers keep showing stale
`v2.css`, `v2.js` and images long after the files change — which looks exactly
like a bug that isn't there. `serve.py` serves the same folder with caching off.

---

## What the files are

```
index.html        the page: markup, the compiled stylesheet, and its own JS
v2.css            brand layer applied over index.html  (loaded as v2.css?b=2)
v2.js             the project brochures — badges and download blocks
img/              photography: *-c.jpg grid covers, *-f.jpg full renders
brochures/        the downloadable project PDFs
firebase.json     Firebase Hosting config with cache headers
CNAME.example     rename to CNAME when moving to GitHub Pages
serve.py          local dev server, no-cache
```

`v2.css` and `v2.js` are **additive**. Delete either and the page still works — it
just reverts to the earlier design, or loses the brochure downloads.

The `?b=2` on the stylesheet and script URLs is a cache-buster. **Bump it to `?b=3`
whenever you change `v2.css` or `v2.js`**, otherwise returning visitors keep the
old copy.
