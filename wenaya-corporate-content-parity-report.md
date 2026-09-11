# Corporate (/corporate) — Content-Parity Mapping Audit (LIVE wenaya.com → local App Router)

**Date:** 2026-09-10 · **Branch:** pre-production-cleanup · **Type:** READ-ONLY AUDIT — no code changed, nothing committed/pushed.

This report maps every section of the **LIVE** `wenaya.com/corporate` page (captured via headless Chrome CDP, 2026-09-10) to the **local** `/corporate` + `/en/corporate` pages, and proposes the allowed next-state per the agreed policy: **content parity (not visual redesign)**, preserving the local premium design system. Allowed actions are limited to: `KEEP`, `KEEP RETREAT`, `REPLACE CONTENT`, `MOVE`, `ADD`, `MERGE`, `REMOVE`, `EXCLUDE LIVE SECTION`.

---

## A. Summary

- **Mapping status: 11 of 15 live zones already have a same-purpose local section.** The remaining 4 live zones are either already excluded by agreement (`Z6` catalogue, `Z8` Yolo), or are content gaps that require `ADD` (`Z3` levels, `Z4` packs).
- **Local-only sections (no live counterpart) sanctioned to stay:** `RetreatSection` (**KEEP RETREAT** — pre-approved) and `ImageBreak` (editorial quote break — local design feature).
- **~10 REPLACE CONTENT / parity-flag candidates** identified (details in §G): padding them requires new FR+EN i18n copy in the **live-verbatim voice** under the existing `entreprises.*` blocks, plus (for packs/resources/testimonials) new data fields.
- **8 content values require a destination** (PDF assets, visuals logos, Yolo platform URL, `Télécharger` targets, timeline for "Yolo sera déployé…") that only the client/backend can supply → listed as **OPEN** in §K.

## B. Live corporate page ground truth

Source: `%TEMP%\opencode\livecorp-corporate.json` (headless Chrome CDP DOM capture, 2026-09-10). 52 headings, 15 top-level zones, 44 CTAs, 448-line body. Readable text dumps: `%TEMP%\opencode\livecorp-zones.txt` + `livecorp-body.txt`.

| # | Live zone (heading, verbatim) | Captured content |
|---|---|---|
| Z0 | "Cultivez le bien-être. Récoltez la performance." | H1 + sub "Un partenaire santé et bien-être au travail qui s'adapte à vos équipes, à vos rythmes et à vos enjeux RH. Pas l'inverse." CTAs: `Réserver un audit gratuit` (→ Google Calendar `https://calendar.app.google/YyAirdPSc2ugGbnh9`), `Télécharger notre catalogue` (→ `#downloads`). |
| Z1 | "Une approche taillée sur mesure pour vos équipes" | Intro "Parce que le bien-être ne s'impose pas, il s'adopte. Wenaya s'adapte aux contraintes réelles du terrain." + 4 pillars — "Adapté à vos horaires", "Anonyme et confidentiel", "À la carte ou en programme", "Présentiel et digital". |
| Z2 | "ILS NOUS FONT CONFIANCE" | Trust strip, **text-only in DOM** (logos render as images; NOT capturable → CLIENT). |
| Z3 | "Par où commencer ?" | "Trois niveaux d'accompagnement selon votre maturité…" — 3 levels **DÉCOUVERTE / PROGRAMME ANNUEL / TRANSFORMATION**, each with tagline ("Vous testez la démarche" / "Vous installez une démarche durable" / "Vous transformez la culture managériale") + rows `Idéal pour`/`Inclus`/`Durée`/`Tarif sur devis personnalisé` + `Demander un devis` CTA. |
| Z4 | "Des exemples concrets pour vous inspirer" | "Trois packs prêts à l'emploi…" — 3 packs labelled **NIVEAU DÉCOUVERTE / NIVEAU PROGRAMME ANNUEL / NIVEAU TRANSFORMATION**: **La Journée Bien-Être Wenaya** (1 conférence 1h/100p, 2 ateliers parallèles, 4 cellules d'écoute, option repas healthy), **Wenaya Présence** (cellules hebdo 4×45min, 1 atelier/mois, 4 conférences/an, accès plateforme **Yolo**, reporting trimestriel), **Leadership Wenaya** (cohorte managers PCM+360+Priorités, coaching direction 8 séances, cellules illimitées 12 mois, accès Yolo + reporting stratégique, bilans 6/12 mois). |
| Z5 | "Nos programmes labellisés" / "PROGRAMMES LABELLISÉS" | Navy (`#0D1F2D`) band — 4 cards: **Process Communication Model®** (NASA · 1978, "Format : 2 jours · Inter ou intra-entreprise", animée formatrice certifiée PCM), **Leadership 360°** ("5 AXES… Format : 3 jours (1+1+1)"), **L'Art des Priorités** ("ANTI-SURCHARGE… Format : 2 jours · Outil Key Timer optionnel"), **People Model Canvas** ("20+ ANS · RECHERCHE & TERRAIN… Format sur mesure"). CTA `En savoir plus` → `/for-entreprise/programmes/{pcm,leadership-360,art-des-priorites,people-model-canvas}`. **Live detail pages have NO images.** |
| Z6 | "Tout ce que Wenaya peut faire pour vos équipes" | Full catalogue — "Soins individuels / Pratiques collectives / Événements ponctuels / Programmes Labels" + 15 spécialités list → **EXCLUDE / DO NOT MIGRATE** (agreed). |
| Z7 | "Des réponses concrètes aux vrais enjeux RH" | "Cinq thématiques couvrent l'essentiel des défis QVT" — 5 themes: TMS & ergonomie / Nutrition / Stress & burnout / Développement personnel & équilibre / Cohésion d'équipe & leadership (each one verbatim line). |
| Z8 | "NOTRE PARTENAIRE TECHNOLOGIQUE Yolo" | Navy→`#194164` gradient. "Yolo — L'agent IA de longévité et de bien-être" + "Wenaya s'associe à Yolo…", "Pour vos collaborateurs / Pour vos RH / Sécurité de niveau entreprise", closing "…Yolo sera déployé chez nos premiers clients corporate dans les…" → **EXCLUDE LIVE SECTION** (no local equivalent, do not re-invent). |
| Z9 | "Notre méthode en 4 étapes" | 4 steps — "Audit des besoins", "Plan personnalisé", "Déploiement", "Suivi et reporting". |
| Z10 | "Pourquoi investir dans le bien-être au travail ?" | 3 cited stats: **3 500 €** (Malakoff Humanis, Baromètre Absentéisme), **+13 %** (Saïd Business School, Oxford 2019), **× 5** (Deloitte, Mental Health & Employers Report 2022) + closing "Chez Wenaya : 35 thérapeutes certifiés · +2 000 collaborateurs accompagnés". |
| Z11 | "Ils nous ont fait confiance" | "Trois histoires concrètes, anonymisées." — 3 anonymous quotes: **DRH multinationale conseil (Big 4) +900**, **DRH filiale marocaine ~200** (séminaire PCM), **DRH scale-up tech ~80**. |
| Z12 | "Ressources pour les directions RH" | 3 docs — **Catalogue de prestations**, **Présentation du programme entreprise**, **Livre Blanc** ("Le vrai coût du mal-être…"), each `Télécharger (PDF)` (destinations = JS on live → require PDF assets). |
| Z13 | FAQ | "Les questions que se posent les directions RH" — 7 Q&A (data protection answer references **Yolo**/RGPD/secret professionnel; adherence; results timeline; SIRH; facturation; multi-site hors Casablanca; flexibilité). |
| Z14 | "Discutons de votre projet bien-être" | `#contact-section`. "30 minutes pour comprendre vos enjeux… Sans engagement." + email/phone(**+212 6 66 12 40 35**)/address(**88 Rue de Jabal Azourki, Casablanca 20930**) + `Réserver un audit gratuit` (calendar) + quote form: `Demander un devis personnalisé`, "Réponse sous 24h ouvrées. Sans engagement.", team-size select (**Moins de 50 / 50 à 250 / 250 à 1 000 / Plus de 1 000**), level select (**À déterminer ensemble / Découverte — événement ponctuel / Programme Annuel — démarche durable / Transformation — culture managériale**), `Envoyer`. |

## C. Local corporate page ground truth

Routes `src/app/(fr)/corporate/page.tsx` + `src/app/(en)/en/corporate/page.tsx` (identical component assembly; metadata differs — FR `Programmes Bien-Être…`, EN `Corporate Wellness — Health & Prevention Programs | Wenaya`).

Section order (shared, top→bottom):

| # | Component | Renders | Locale key(s) |
|---|---|---|---|
| L1 | `entreprises/Hero.tsx` (client, cinematic `ch-*` use) | H1 "Cultivez le bien-être. Récoltez la performance." (masked lines) · bullet list (`hero.bullets`) · `cta1`→`https://calendar.app.google/YyAirdPSc2ugGbnh9` · `cta2`→`#downloads`. **H1 + CTAs byte-match LIVE Z0.** | `entreprises.hero.*` |
| L2 | `HowItWorksSection.tsx` (client) | eyebrow + H2 "Notre méthode en 4 étapes" + 4 numbered steps (**Audit des besoins / Plan personnalisé / Déploiement / Suivi et reporting**) + board callout. **Step titles byte-match LIVE Z9** (local descs are live-verbatim-expanded). | `entreprises.approach.*` |
| L3 | `ModularitySection.tsx` (client) | eyebrow + H2 "Une approche modulaire" + 4 pillars (**Prévention & Bilans / Santé Mentale / Physique & Nutrition / Performance & Leadership**). | `entreprises.modularity.*` |
| L4 | `ProgrammesSection.tsx` (client, carousel) | badge + H2 "Nos programmes labellisés" + swipe carousel of the 4 programmes (cards link to `/corporate/programmes/{slug}` via `getProgrammeHref`). **Name-level matches LIVE Z5; per-card "Format / Animée par / badge" lines require a parity pass (§G.3).** | `entreprises.programmes.*` + `src/lib/corporate-programmes.ts` |
| L5 | `RetreatSection.tsx` (client) | "Aucun retreat ne devrait être standard." + 3 chapters (Reset & Recharge / Team Health & Cohesion / Active Wellness) + "Build Your Retreat" + CTA→`#contact`. **No live equivalent — KEEP RETREAT (exception).** | `entreprises.retreat.*` |
| L6 | `ThematiquesSection.tsx` (client, interactive explorer) | badge + H2 "Des réponses concrètes aux vrais enjeux RH" + 5 theme selectors (all stay in DOM for SEO/LLM). **Title + 5 themes byte-match LIVE Z7.** | `entreprises.programs.themes` |
| L7 | `ImageBreak.tsx` (client, parallax quote) | Full-width editorial quote/image break (~64vh, navy). **No live equivalent — local design feature (fine).** | `entreprises.imageBreak` (image from Unsplash) |
| L8 | `StatsTestimonialsSection.tsx` (client) | Bronze band: 4 metrics (35+ / 2 000+ / 96% / 7 ans) + impact strip (−40% / +25%) + **single OCP testimonial** + 1/3 counter + arrows + dots. **Overlaps LIVE Z10 (stats) + Z11 (testimonials); parity gaps §G.4.** | `entreprises.stats.*` / `entreprises.testimonials.*` |
| L9 | `ResourcesFaqSection.tsx` (client) | Resources (left) + FAQ accordion (right) under **`id="downloads"`** (hero `cta2` anchor). **Structural match for LIVE Z12+Z13.** | `entreprises.downloads.*` / `entreprises.faq.*` |
| L10 | `ContactSection.tsx` (client) | H2 "Discutons de votre projet bien-être" (no period) + contact rows (mailto `corporate@wenaya.com`, tel `+212666124035`, `88 Rue de Jabal Azourki, Casablanca 20930`) + `Réserver un audit gratuit` (calendar) + quote form (`firstName`/`lastName`/`email` + `teamSize` select + `programmeLevel` select + `Envoyer` → `/api/contact`, `source="corporate-quote"`). **Byte-matches LIVE Z14** (incl. all 8 option labels). `id="contact"` + `data-contact`. | `entreprises.contactSection.*` |
| L11 | `StickyCta.tsx` (client, mobile only) | Fixed bottom pill `lg:hidden`, appears after scrollY>600, auto-hides 15s/on-click, scrolls to `[data-contact]`. **No live equivalent — fine.** | `entreprises.stickyCta.cta` |
| L12 | `Footer.tsx` (`EntreprisesFooter`)| Dark B2B footer: logo, nav, socials (LinkedIn/Instagram), legal links, hours, copyright. | `entreprises.footer.*` |

Also relevant (NOT on `/corporate`): `CorporateConsultationWidget` floating pill (rendered sitewide from both root `layout.tsx`, comment "Floating consultation pill on /corporate" — actually renders on **every** page; `<li><a>` nav "Pour les entreprises"→`/corporate`), `ProgrammesPage.tsx` (`/corporate/programmes` listing, server component) + `ProgrammeDetail.tsx` (`/corporate/programmes/[slug]`, server component) built from shared `src/lib/corporate-programmes.ts` with verbatim-live French bodies.

## D. Zone-by-zone mapping table (LIVE → local)

| Live zone | Local element | Recommended action |
|---|---|---|
| Z0 Hero | L1 `hero` | **KEEP** (already byte-parity: H1, desc, cta1, cta2). Verify `hero.bullets` vs live hero bullet copy, if any (§G.1). |
| Z1 4 pillars | L3 `modularity.pillars` (4 titles/desc) | **REPLACE CONTENT** — local pillars "Prévention & Bilans / Santé Mentale / Physique & Nutrition / Performance & Leadership" ≠ live "Adapté à vos horaires / Anonyme et confidentiel / À la carte ou en programme / Présentiel et digital" titles AND the live intro quote. Nearest existing home = **ModularitySection** (4-pillar layout). Note: live Z1 pillars also duplicate `programs.offers` titles on the live page itself (Z0-tabbed). |
| Z2 Trust logos | none | **ADD** (new trust-logo strip under hero) — requires brand-logo assets as `{name, logoPath}` from CLIENT (logos not capturable; visually validate). If no assets: **KEEP ABSENT** + document. Use live tagline "ILS NOUS FONT CONFIANCE" (already in `programs.ilsNousFontConfiance`). |
| Z3 Levels | none | **ADD** (3-level selector "Par où commencer ?") — new section (or merge INTO ModularitySection as a level list). Verbatim copy captured §B-Z3. Each level CTA `Demander un devis` → `/corporate#contact`. Flat 1-column layout (premium site keeps cards elsewhere). |
| Z4 Packs | none | **ADD** ("Des exemples concrets…" 3 packs). Verbatim copy captured §B-Z4. CTA `Demander un devis personnalisé` → `/corporate#contact`. `ADD` **requires** Yolo platform URL (pack 2/3 mention "accès plateforme Yolo") + programme names already verbatim — 2 OPEN values (§K). |
| Z5 Programmes | L4 `ProgrammesSection` | **REPLACE CONTENT** — align each carousel card so its visible fields match live: badge ("NASA · 1978", "5 AXES", "ANTI-SURCHARGE", "20+ ANS · RECHERCHE & TERRAIN"), "Format : …", "Animée par…". Data must stay in `corporate-programmes.ts` (single source → carousel + listing + detail all update). |
| Z6 Catalogue | (none) | **EXCLUDE LIVE SECTION** (agreed). Optionally note the live `Catalogue de prestations` PDF (Z12) as the consumer path. |
| Z7 5 thématiques | L6 `ThematiquesSection` (`programs.themes`) | **REPLACE CONTENT** — titles already match; align **desc** to live-verbatim one-liners (live: "Réduire l'absentéisme lié aux douleurs physiques (TMS, lombalgies, tendinites)…"). Keep interactive explorer design. |
| Z8 Yolo | none | **EXCLUDE LIVE SECTION** (agreed). Consequence: org-local extras must not be silently derived from live copy (do not resurrect the local dead `entreprises.yolo` i18n block without client go-ahead; §G.7). |
| Z9 4 steps | L2 `HowItWorksSection` (`approach.steps`) | **KEEP** (step titles already byte-parity; local descs live-verbatim-expanded — acceptable richer prose; settle in §G.2). |
| Z10 Stats | L8 `StatsTestimonialsSection` | **KEEP** stats disposition — but align the 3 impact numbers + 4 metric labels + 2 sources to the LIVE verbatim trio (3 500 € / +13 % / × 5 + sources + "Chez Wenaya : 35 thérapeutes certifiés · +2 000 collaborateurs accompagnés") so the same underlying data renders consistently. |
| Z11 Testimonials | L8 (single OCP quote) | **REPLACE CONTENT** — swap-in the 3 live anonymous quotes (Big 4 DRH +900 / ~200 PCM / ~80 scale-up), spar-testing the component's counter+dots was built for exactly N≥1 slides. OCP quote currently shares the counter → replace **all** slides; kiosk the 1/3 counter + dots then match 3 slides. |
| Z12 Resources | L9 `ResourcesFaqSection` (left) | **REPLACE CONTENT** — set resource items to the live 3 (Catalogue de prestations / Présentation du programme entreprise / Livre Blanc), each `Télécharger (PDF)` → actual PDF URL. **PDF assets = OPEN** (§K). Keep `id="downloads"` anchor. |
| Z13 FAQ | L9 (right accordion) | **REPLACE CONTENT** — replace/expand local FAQ set with the live 7 Q&A, localizing to the existing silver accordion pattern. FAQ #1 answer references **Yolo** + RGPD → matches "exclude live section" stance? No: consumer-facing answer stands on its own only if Yolo is real. Flag **OPEN** — keep without Yolo sentence, or adopt only after Yolo decision (avoid inventing). |
| Z14 Contact | L10 + L11 + L12 | **KEEP** (already byte-parity on the whole capture incl. option labels + contact rows + calendar CTA). |

## E. Exclusions (confirmed, both live AND local)

- **EXCLUDE LIVE SECTION:** `Z6` "Tout ce que Wenaya peut faire pour vos équipes" (catalogue; would recreate a whole `/pratiques`-style catalogue on /corporate). **Do not migrate.**
- **EXCLUDE LIVE SECTION:** `Z8` "NOTRE PARTENAIRE TECHNOLOGIQUE Yolo" (no local equivalent; not to be re-invented). Local dead `entreprises.yolo` i18n stays orphaned until client decides.
- **KEEP RETREAT (exception):** local `RetreatSection` stays — no live counterpart required.
- **KEEP (local-only design):** `ImageBreak`, `StickyCta`, `Footer`, `CorporateConsultationWidget` — no live mapping needed.

## F. Verbatim content anchors (live copy to preserve byte-for-byte)

All of these already exist verbatim in the local i18n or are captured live for future REPLACE steps:
- H1/desc & hero CTAs (L1 == Z0) ✅ byte-parity.
- 4 method-step titles (L2 == Z9) ✅.
- 5 thématiques title list (L6 == Z7 heading) ✅ titles; desc → align.
- Low-level contact + form (L10 == Z14) ✅ byte-parity (identity fields, 8 option labels, hours strip).

## G. REPLACE CONTENT / parity-flag candidates (the §D detail)

1. **`hero.bullets`** — local renders a 3-bullet list ("Réduire l'absentéisme…", "Renforcer l'engagement…", "Attirer et fidéliser les talents"); live Z0 shows CTAs + the 3 value bullets (Z1 pillars are separate). **Check** hero vs live bullets in a browser; if detached, align or drop.
2. **`approach.steps` descs** — local descs are expanded live-verbatim prose; live Z9 descs are short ("Diagnostic confidentiel via questionnaire anonyme et échange avec votre direction RH."). Decide: keep richer prose (recommended) or trim to live-single-line.
3. **`corporate-programmes.ts` card fields → live Z5 cards** — add `badgeLine` / `formatLine` / `animatorLine` to each of the 4 programmes. All 4 live strings byte-captured.
4. **`stats`/`testimonials`** — restructure band to the live-verbatim stats trio (+ sources) and the 3 live anonymized quotes (kiosk the OCP quote only if a client-approved testimonial set is not yet live).
5. **`downloads`** — swap resources for the 3 live docs + PDF URLs (OPEN).
6. **`faq`** — swap Q&A set for the 7 live Q&As (data-trigger §K).
7. **dead i18n** — orphaned one-time blocks (`levels`, `packs`, `expertises`, `programs.offers` duplication, `cta.supportCards`/`dirigeants*`, full `yolo` block, `approach.stats`/`comparison`) exist because earlier versions of the page rendered them; none are consumed by `/corporate` today (grep-verified). **Do not delete** (may become live-parity homes for Z3/Z4); they are flagged for the JS/TS/trim pass only.

## H. ADD candidates (new content to reach live parity)

- **Z2 trust-logo strip** (assets: CLIENT)
- **Z3 "Par où commencer ?" 3 levels** (verbatim data ready; CTA → `#contact`)
- **Z4 "Des exemples concrets…" 3 packs** (verbatim data ready; requires Yolo URL for pack 2/3)

## I. Proposed unchanged / new page order

Final proposed local order (1 KEEP block — no hero/retreat/breaks reordered; `ADD`s flow between L6/L7 to respect the live cadence):

> L1 Hero (_Z0_) → **NEW Z2 logos** → L2 Method steps (_Z9_) → L3 Modularity → L4 Programmes (_Z5_) → L5 Retreat (**KEEP RETREAT**) → **NEW Z3 Levels** → **NEW Z4 Packs** → L6 Thématiques (_Z7_) → L7 ImageBreak → L8 Stats (_Z10/Z11_) → L9 Resources+FAQ (_Z12/Z13_) → L10 Contact (_Z14_) → L11 StickyCta → L12 Footer

## J. Data, design, locale & route constraints

- **Content source of truth:** French = live-verbatim (`corporate-programmes.ts` policy + captured zones). EN serves the same French content under `lang="en"` (live `/en/corporate` does the same) with localized chrome.
- **Design:** local premium system preserved (sand/ivory bands, `#0B1220` navy, `#B88A5A` bronze, serif `heading-serif`, no cards where live uses cards). Live-only soft values (`#0D1F2D` navy, `#194164` gradient) NOT reused.
- **Images:** all local corporate imagery is Unsplash (decorative); live Z5/Z12/Z14 have no photos. No new image work required.
- **Routes/CTAs:** `/corporate/programmes` + `/corporate/programmes/[slug]` unchanged (existing 308 PCM legacy redirects). Audit CTA stays external Google Calendar. Quote CTAs stay `/corporate#contact` / `/en/corporate#contact`.
- **i18n:** all copy lives in `src/i18n/fr.ts` + `en.ts` `entreprises:` blocks (line 524 both files; fr block ends ≈ line 1029 before `clinics:` at 1031); new keys added there only.
- **SEO:** page keeps exactly one `<h1>`; no route/metadata/hreflang/sitemap change anticipated (no new routes).

## K. Open decisions (client/backend required)

1. **Z2 logo assets** — names (client) for the trust strip. If none, skip.
2. **Z12 PDFs** — 3 hosted PDF URLs (Catalogue, Présentation, Livre Blanc) — currently just "Télécharger (PDF)" on live with no reachable URL.
3. **Z8/Yolo** — confirm Yolo is a real partner to keep in packs/FAQ (else drop mentions); the packs "accès plateforme Yolo" line + FAQ #1 need this.
4. **Z4 Yolo platform URL** — if packs are adopted, the platform link target.
5. **Z11 testimonials** — approve 3 anonymous live quotes replacing the single OCP quote (drives the 1/3 counter to full 3 slides).
6. **Z3/Z4 placement** — approve insertion point (proposed: after Retreat, before Thématiques) + whether levels/packs render as two separate sections or merged.
7. **`hero.bullets`** + step-desc verbosity (G.1/G.2) — approve alignment or retention.

---

**Verification plan (when implemented):** SSR HTTP checks per section (one H1, section presence, byte-parity probes on all live-verbatim lines using `&#x27;`/`&amp;`-escaped forms), real-browser CDP at 1440/768/390 (no horizontal overflow, carousel drag, accordion, form submit), `npx tsc --noEmit`, `npx eslint .` (baseline 0E/10W must stay), clean 278-page build. Nothing from this audit is committed or pushed.