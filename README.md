# Mina Armanious: personal website

A static site with no build step: `index.html`, `css/styles.css`, `js/main.js` and `assets/`.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `?lang=ar` to the address to open the Arabic version.

## Publish

Drag this folder onto https://app.netlify.com/drop. Cloudflare Pages and GitHub Pages also work.
After you connect a domain, update two things in `index.html`:

- `<link rel="canonical" href="/">`: change it to the full address.
- `og:image`: change it to the full address of `assets/img/og-image.jpg`, so LinkedIn and WhatsApp previews show the image.

## Settings you will want to change

These are at the top of `js/main.js`:

- `bookingUrl`: paste a Google Calendar appointment-schedule link or a Calendly link. Every "Request a meeting" button will then open it. Left empty, the buttons open an email.
- `email` / `phone`: used for the downloadable contact card (vCard).

The email and phone are also written directly in `index.html`, in the Contact section and the `mailto:` links, so change them there too.

## Editing content

- English text is the normal text inside each element. The Arabic version of that text is in the element's `data-ar` attribute. When you edit one language, edit the other as well.
- **Transactions** are shown as deal tombstones: each is an `<article class="tx tomb" data-cat="...">`, and adding `tomb-wide` makes one span two columns. The categories are `bf` (Banking & Finance), `sf` (Structured Finance), `vc` (Venture Capital), `ma` (M&A & Diligence) and `cc` (Corporate & Commercial). To add a matter, copy an existing card.
- **Achievements**: the `#achievements` section (an award card plus a list of milestones).
- **Colours and fonts**: the CSS variables at the top of `css/styles.css`.

## Files

| File | Purpose |
|---|---|
| assets/docs/Mina_Armanious_CV.pdf | CV, used by every Download CV button |
| assets/docs/Mina_Armanious_Credentials.pdf | Scanned certificates, compressed from 7.3 MB to 1.8 MB |
| assets/img/portrait-editorial.jpg | Hero portrait (black-and-white editorial treatment) |
| assets/img/banque-misr-editorial.jpg | Profile photo (same treatment) |
| assets/img/portrait.jpg, portrait-banque-misr.jpg | Original colour photos, kept as sources |
| assets/img/og-image.jpg | Preview image shown when the link is shared |
| assets/img/favicon.svg, apple-touch-icon.png | Browser-tab and phone home-screen icons |
