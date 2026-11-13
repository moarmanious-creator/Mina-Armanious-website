# Mina Armanious: Executive Profile website

A static, bilingual (English / Arabic) website designed as a full-screen slide show.
It needs no build step: `index.html`, `css/styles.css`, `js/main.js` and `assets/`.

Live (once GitHub Pages is on): https://moarmanious-creator.github.io/Mina-Armanious-website/

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `?lang=ar` for Arabic, or `#credentials` (any slide id) to open a specific slide.

## How the slide show works

- Each `<section class="slide">` inside `<main class="deck">` is one slide. Its `data-title` and `data-title-ar` attributes feed the
  slide index ("Contents"), the dot rail and the title in the top bar.
- Visitors can move between slides with the arrow keys, Page Up/Down, the mouse wheel, swiping, the arrow buttons at the bottom right,
  the dot rail, or the Contents menu.
- On phones and short screens, slides scroll freely instead of snapping one at a time.
- Elements marked `data-anim` animate in when their slide becomes active.

To add a slide, copy a `<section class="slide ...">` block. Use `s-dark` (navy) or `s-light` (ivory) and alternate them.

## Documents (assets/docs)

| File | Used by |
|---|---|
| Mina_Armanious_CV.pdf | Every CV button |
| Mina_Armanious_Certificates.pdf | View certificates / Professional certificates |
| Mina_Armanious_Executive_Profile.pptx | Executive Profile presentation (the link stays hidden until this file exists) |

To update one, replace the file with one of exactly the same name.

## Logos (assets/logos)

Logos were cropped from the certificate scans and the original site's files: Banque Misr, BM Ventures, FAB Misr,
Banque du Caire, ABK, AUC, IMF, HSBC, EBI, BUE, Orascom, Agiba, PMS and Petrotrade.

Kouncel and AfDB have no logo file yet, so they show as typeset names (`logo-word`). To use a real logo, add the file and
replace `<span class="logo-tile cert-logo logo-word">Kouncel</span>` with
`<span class="logo-tile cert-logo"><img src="assets/logos/kouncel.png" alt="Kouncel"></span>`.

Logos belong to their owners; the footer disclaimer says they are used for identification only.

## Editing text

English is the normal text inside each element; the Arabic version is in its `data-ar` attribute. When you edit one language,
edit the other as well. Colours and fonts are CSS variables at the top of `css/styles.css`.
