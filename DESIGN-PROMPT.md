# Design prompt: "Counsel to Capital"

A reusable brief that describes this website's design. Paste it into an AI design or coding tool, or hand it to a designer, to
recreate the same look for a new page, a future law-firm site, or matching material (CV, presentation, letterhead).

---

## The prompt

Design a single-page personal website for a senior lawyer who is Head of Legal for Private Equity and Venture Capital. The
audience is boards, investors, executive search firms and general counsel. The site must say, within seconds, "this is a
top-tier deal lawyer". It should feel like the website of a leading private-equity firm or an elite international law firm:
dark, quiet, confident, numbers-first, with no decoration that does not carry information.

**Visual direction: capital-markets noir**
- Two alternating full-width bands: obsidian `#0B0B0C` and warm bone `#F3EFE8`. Thin hairline rules separate content;
  no cards with shadows, no rounded corners.
- One accent only: champagne gold. Use a flat `#C8B07A` for lines and labels, and a brushed-metal gradient
  `linear-gradient(105deg, #A88D58, #E7D6AD 42%, #B89A62 64%, #8F7646)` sparingly for the key italic word in each headline,
  the main button and the single most important number.
- Text colours: `#EFEBE4` on dark, with `#9E9CA0` for secondary text; `#111113` on bone, with `#64646B` for secondary text.
  Small gold text on bone uses the darker `#8A7442` for contrast.

**Typography**
- Display: Bodoni Moda, a high-contrast Didone. Very large and tightly tracked (−0.02 to −0.035em). Each headline sets one
  word in italic, and that word carries the gold.
- Text: Inter Tight. Labels and buttons are uppercase, small (11–12px) and widely tracked (0.2–0.34em).
- Numbers: Bodoni lining figures, very large, with a small tracked "USD" unit set in front.
- Arabic: Amiri for display and IBM Plex Sans Arabic for text, with all letter-spacing removed and full right-to-left mirroring.

**Layout and sections**
1. **Hero (dark, full screen).** A black-and-white portrait bleeds off the right edge and fades into black on its left and
   bottom edges. On the left:
   - a small gold kicker with the job title;
   - a giant two-line headline, "Counsel / to *capital.*", whose lines slide up on load;
   - the name, tracked uppercase with a short gold rule;
   - one sentence of positioning;
   - a gold "Selected mandates" button and an outlined "Contact" button.

   A four-column strip of key figures, divided by hairlines, sits along the bottom.
2. **Current position (bone).** A large serif statement of philosophy on the left. On the right, a short bio and the current
   roles, each with its institution's logo.
3. **Practice (dark).** The work shown as the investment lifecycle in six numbered stages on a 3 × 2 hairline grid: fund
   commitments, structuring, due diligence, negotiation and closing, portfolio and governance, external counsel and controls.
   A gold line draws across a stage on hover. A row of outlined "instrument" tags follows (LPA, SAFE, SPA, SHA…).
4. **Deal ledger (bone).** Mandates as a refined table with columns Type / Mandate / Detail / Role. The headline figure of
   each row is in large Bodoni (USD 3M, SAFE · CN…). Filter buttons switch between all mandates, PE & VC, and Banking & M&A.
   Hovering a row adds a faint gold wash and nudges the row inward. A confidentiality note sits at the end.
5. **Reach (dark).** A dot-matrix world map with the relevant countries lit in gold (banking) or slate (PE/VC), and dashed
   arcs from the home city. Beside it, a detail panel that changes when a country is hovered, plus country buttons.
6. **Record (bone).** Large animated figures counting up, a three-bar chart with the middle bar in gold, and a black
   "flagship achievement" strip showing a before → after comparison.
7. **Career (dark).** A minimal list: years, institution logo, title and one line of scale. A gold underline draws across
   the row on hover.
8. **Credentials (bone).** A four-column band (degree, bar admission, international bar membership, and a black card for
   the degree in progress with a pulsing dot), then a two-column list of certifications, each with its logo.
9. **Endorsements (dark).** One large italic quote at a time, auto-rotating, with gold quotation marks and thin progress
   bars.
10. **Contact (bone).** "For mandates, board matters *and senior appointments.*", document buttons (CV, certificates,
    contact card) and an editorial contact list.
11. **Footer (dark).** A legal disclaimer stating that the site is not an offer of legal services and that logos are used
    for identification only.

**Logos**
Show every institution in one colour, never in its brand colours: navy-black on bone sections and soft ivory on dark ones.
Size each logo to the same visual weight: wide wordmarks shorter, square emblems taller, each within a maximum width for
its position. On bone sections, the original colours may fade in on hover.

**Motion** (subtle and slow, eased with `cubic-bezier(.16, 1, .3, 1)`)
- Sections fade up 30px when scrolled into view.
- Headline lines slide up from a mask.
- The portrait settles from a slight zoom.
- Numbers count up and chart bars grow.
- Map arcs draw in and the pins pulse softly.
- A 1px gold reading-progress line runs at the very top.

Respect `prefers-reduced-motion`: show everything static.

**Header**
Transparent over the hero, with a dark fade behind it so it stays readable over the photo. On scroll it becomes a frosted
black bar. It holds a thin line monogram, the name in tracked capitals, a short nav with a gold underline that draws on
hover, an Arabic/English toggle and an outlined gold CV button.

**Writing**
Short, declarative and specific. Use investment vocabulary (mandate, LP commitment, portfolio, closing). Lead with
figures. Withhold counterparty names for confidentiality. Make no claims the CV cannot support.

**Technical**
- A static HTML/CSS/JS page with no framework.
- Bilingual through `data-ar` attributes.
- Fully responsive: on phones, sections stack to one column and the portrait moves above the headline.
- Accessible contrast and visible focus states.
- Schema.org Person markup, Open Graph tags and a 1200×630 social preview image in the same style.

---

## Design tokens

| Token | Value | Use |
|---|---|---|
| Obsidian | `#0B0B0C` | Dark bands, hero, footer |
| Bone | `#F3EFE8` | Light bands |
| Ink | `#111113` | Headlines on bone |
| Muted (bone) | `#64646B` | Body text on bone |
| On-dark | `#EFEBE4` | Headlines on dark |
| Muted (dark) | `#9E9CA0` | Body text on dark |
| Champagne | `#C8B07A` | Lines, labels, small accents |
| Champagne deep | `#8A7442` | Small gold text on bone |
| Metal | `linear-gradient(105deg, #A88D58, #E7D6AD 42%, #B89A62 64%, #8F7646)` | Key word, main button, hero figure |
| Display font | Bodoni Moda 400 / 400 italic | Headlines, figures |
| Text font | Inter Tight 400–500 | Body, labels, buttons |
| Arabic fonts | Amiri; IBM Plex Sans Arabic | Arabic display; Arabic text |
