# Mina Armanious: personal website

A static, bilingual (English / Arabic) single-page website. It needs no build step: `index.html`, `css/styles.css`,
`js/main.js` and `assets/`.

Live (once GitHub Pages is on): https://moarmanious-creator.github.io/Mina-Armanious-website/

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `?lang=ar` for Arabic.

## Sections

Hero (with the institutions band), I Profile, II Track record, III Experience, IV Mandates & transactions (two tabs),
V Flagship achievement, VI Core expertise, VII Credentials, VIII Endorsements, IX What I bring, then Contact.

## Logos (assets/logos)

Every institution has three files:

- `name.png`: the original colours on a transparent background.
- `name-ink.png`: a single-colour navy version, used on the ivory sections.
- `name-ivory.png`: a single-colour ivory version, used on the navy sections.

Using one colour per section is what makes all the logos look like a matching set. On the ivory sections, the original
colours fade in when a visitor hovers. `js/main.js` sizes each logo so wide wordmarks and square emblems carry equal
visual weight. Each position caps a logo's height with the `--lh` CSS variable and its width with `--lw`.

Sources: Wikimedia Commons (Banque Misr, FAB, Banque du Caire, ABK, IMF, HSBC, Cairo University,
Universität Hamburg, Arab League) and the institutions' own websites (AUC, IBA, Ain Shams University, Egyptian Banking
Institute, BUE, Kouncel, Orascom Construction). The BM Ventures logo comes from the original site files.

Still missing:

- **Egyptian Bar Association:** shown as a typeset "EBA" badge. To use the real logo, add
  `egyptian-bar.png`, `egyptian-bar-ink.png` and `egyptian-bar-ivory.png`, then replace each
  `<span class="seal-mark" ...>EBA</span>` with a `.lg` logo like the others.
- **Afreximbank, Agiba, PMS, Petrotrade, EIFA and ACA:** shown as text.

## Documents (assets/docs)

| File | Used by |
|---|---|
| Mina_Armanious_CV.pdf | Every CV button |
| Mina_Armanious_Certificates.pdf | View certificates / Professional certificates |
| Mina_Armanious_Executive_Profile.pptx | Executive Profile presentation (the link stays hidden until this file exists) |

To update one, replace the file with one of exactly the same name.

## Editing text

English is the normal text inside each element; the Arabic version is in its `data-ar` attribute. When you edit one language,
edit the other as well. Colours and fonts are CSS variables at the top of `css/styles.css`.
