# Pocket Home

Landing page for **Pocket Home** — a design and build studio in Chennai working on
compact plots.

A single static page: no framework, no build step, no dependencies. The repository
root *is* the site.

| | |
|---|---|
| **Review build** | <https://arnikhilrodrigo.github.io/pockethome-site/> |
| **Target domain** | `pockethome.nichekala.in` — **not yet pointed here** |
| **Deploying it** | **see [DEPLOY.md](DEPLOY.md) first** |

> **Note for whoever deploys this.** `pockethome.nichekala.in` currently resolves to
> Firebase and is serving an **older build** of this page. This is a replacement.
> Before deploying to Firebase, check which plan that project is on — the free tier
> allows 360 MB/day and this site carries ~31 MB of renders and brochures.
> [DEPLOY.md](DEPLOY.md) has the numbers and both deployment routes.

## Running it locally

```bash
python serve.py
```

Then open <http://localhost:5520>.

Use `serve.py` rather than `python -m http.server`. The built-in server sends
`Last-Modified` and answers with `304 Not Modified`, so browsers keep showing an
old `v2.css`, `v2.js` or image long after the file on disk has changed — which
looks exactly like a bug that isn't there. `serve.py` serves the same folder with
caching switched off.

## What's here

```
index.html        the page — markup, the original compiled stylesheet, and its own JS
v2.css            the Pocket Home brand layer, applied on top of index.html
v2.js             the project brochures ("the surprise")
img/              project photography — *-c.jpg covers, *-f.jpg full renders
brochures/        the downloadable project PDFs
CNAME             the custom domain
serve.py          local dev server, no-cache
```

`v2.css` and `v2.js` are **additive layers**. Remove them and the page still works;
it just reverts to the earlier design and loses the brochure downloads.

## The brand

| | |
|---|---|
| Display | Fraunces, weight 400 — italic in red for accent words |
| Text | Manrope |
| Hand | Caveat, for the amber asides |
| Red | `#D2352A` |
| Paper | `#F4F1EE`, panels `#FBF9F7` |
| Blush / amber | `#FCEBE8` / `#C7811B` |

These mirror the Know Your Home app at <https://knowyourhome.nichekala.in>, so the
two sites read as one practice. Tokens live in one `:root` block at the top of
`v2.css`.

## Adding a project brochure

1. Drop the PDF in `brochures/`.
2. Add one line to `BROCHURES` at the top of `v2.js`, keyed by the project name
   exactly as it appears on the card:

```js
"Thuli": { file: "brochures/thuli.pdf", pages: 9, mb: 2.2 },
```

That's all — the badge on the card and the download block in the lightbox are
both driven from that map.

## Deploying

See **[DEPLOY.md](DEPLOY.md)** — it covers both Firebase and GitHub Pages, the
DNS change, and the quota warning that decides between them.

## Still to do

- [ ] Confirm every plot area and BHK count on the fifteen project cards.
- [ ] Three projects still have no brochure (Thuli, Stack, Angle, Hues, Root,
      Karai, Urban Reno have none; Frame, Curve, Panorama Box, Inside-Out,
      Vaanam, Illam, Nest, Arjavam do).
