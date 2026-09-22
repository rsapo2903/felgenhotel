# Felgenhotel – Handoff

Arbeitsstand nach Phase 0. Dieses Dokument ist die einzige benötigte Grundlage, um weiterzuarbeiten.

## 1. Projektziel und Designrichtung

Neubau der Website für **FELGENHOTEL**, Betrieb für Felgenreparatur und Felgenveredelung, Herler Straße 21, 51067 Köln. Die bestehende Seite felgenhotel.de dient ausschließlich als Inhaltsquelle, nicht als technische Basis.

Positionierung: **Dark Luxury Automotive** – die Seite soll sich wie eine hochwertige Automotive-Marke anfühlen, nicht wie eine lokale Werkstatt-Website. Viel Schwarzraum, große Typografie, wenige UI-Elemente, keine Template-Muster (keine drei identischen Feature-Cards, kein Glassmorphism, keine generischen Gradients, keine großen Border-Radien).

Farben:

| Rolle                | Wert      |
| -------------------- | --------- |
| Background           | `#080808` |
| Secondary Background | `#111111` |
| Card / Surface       | `#161616` |
| Primary Text         | `#F5F5F5` |
| Secondary Text       | `#A3A3A3` |
| Borders              | `#292929` |
| Metallic Accent      | `#C8C8C8` |
| White                | `#FFFFFF` |

Gold ist **keine** Markenfarbe – es erscheint ausschließlich inhaltlich bei der Leistung Vergoldung.

Typografie: **Space Grotesk** für Display/Headings, **Inter** für Body. Maximal zwei Schriftfamilien. Headlines Desktop 80–120px, Mobile 48–64px, Body 17–20px. Editorial und technisch, keine kleinen Texte.

Tonalität: Premium, direkt, verständlich – nicht werblich, keine Superlative. Der Besucher muss in Sekunden erfassen: Was macht Felgenhotel, wo, welche Leistungen, wie stelle ich eine Anfrage.

**Auf der Website werden grundsätzlich keine Preise kommuniziert.** Kein Preisrechner, keine „ab X €". Conversion läuft über: Bilder hochladen → Begutachtung → individuelles Angebot.

## 2. Tech-Stack (bestätigt)

| Bereich      | Wahl                                        | Version                |
| ------------ | ------------------------------------------- | ---------------------- |
| Framework    | Next.js, App Router, Turbopack              | 16.3.6                 |
| React        | React / React DOM                           | 19.2.8                 |
| Sprache      | TypeScript strict                           | ^5                     |
| Styling      | Tailwind CSS                                | ^4                     |
| Motion       | GSAP inkl. ScrollTrigger                    | ^3.15                  |
| Formular     | React Hook Form + Zod + @hookform/resolvers | 7.88 / 4.6             |
| Spam-Schutz  | Cloudflare Turnstile                        | noch nicht installiert |
| Mail         | Resend                                      | noch nicht installiert |
| Formatierung | Prettier + prettier-plugin-tailwindcss      | ^3.9                   |
| Paketmanager | npm 11.19 (pnpm/yarn/bun nicht installiert) | –                      |
| Deployment   | Vercel                                      | –                      |

Node v26.8.1. Sharp und Dateityp-Erkennung werden erst in Phase 9 installiert, wenn die Upload-Variante feststeht.

**Next.js 16 weicht von älterem Wissen ab.** Versionsgenaue Docs liegen unter `node_modules/next/dist/docs/`, `AGENTS.md` verweist darauf. Relevant: Turbopack ist Standard für `dev` und `build`, `middleware` heißt jetzt `proxy`, Request-APIs (`params`, `searchParams`, `cookies()`, `headers()`) sind async, `next lint` ist durch die ESLint-CLI ersetzt.

MCP-Tools verfügbar: **Context7** (versionsaktuelle Doku) und **Playwright** (QA-Phasen). Der Server `magic` ist nicht verbunden, für dieses Projekt nicht erforderlich.

## 3. Projektstruktur

```
app/              Routen (App Router), layout.tsx mit lang="de" + metadataBase
components/       layout/ hero/ services/ gallery/ reviews/ contact/ ui/
data/             site.ts (Stammdaten); später services.ts, reviews.ts, nav.ts
lib/              gsap/ validation/ mail/ upload/ turnstile/
types/
public/assets/    brand/ hero/ placeholders/
docs/             dieses Dokument
```

Kein `src/`-Verzeichnis, Import-Alias ist `@/*`. Leere Verzeichnisse sind mit `.gitkeep` versioniert.

## 4. Architekturentscheidungen

- **`data/site.ts` ist die einzige Quelle** für Adresse, Telefon (`0221 – 259 84 202`), Mobil (`+49 178 5071710`), E-Mail (`info@felgenhotel.de`), Öffnungszeiten (Mo–Fr 09:00–18:00, Sa 09:00–14:00) und den vorbefüllten WhatsApp-Text. Header, Footer, Kontakt und das LocalBusiness-Schema greifen darauf zu.
- **Leistungen werden datengetrieben** in `data/services.ts` gepflegt, nicht mehrfach hartcodiert. Hierarchie: Felgenreparatur (Smart Repair, Felgen richten, Lackierung) und Felgenveredelung (Pulverbeschichtung, Poliertechnik, Oberflächenveredelung, Vergoldung).
- **GSAP zentral in `lib/gsap/`**: ScrollTrigger einmal registrieren, jede Animation in einem GSAP-Context mit garantiertem `revert()` beim Unmount. Keine verstreuten Animationen, keine Memory Leaks. Achtung React Strict Mode: doppelte Effect-Ausführung darf keine doppelten ScrollTrigger erzeugen.
- **Ein Zod-Schema** in `lib/validation/` wird client- und serverseitig importiert, damit Validierung nicht auseinanderläuft.
- **Secrets nur serverseitig**: Turnstile Secret Key und Resend API Key niemals in Client Components oder `NEXT_PUBLIC_*`. `.env.example` dokumentiert die Variablennamen ohne Werte.
- **Fonts über `next/font`** – lädt zur Build-Zeit und hostet selbst, dadurch kein Runtime-Request an Google und kein Consent-Bedarf für Fonts.
- **Google Maps als Click-to-load**, nicht automatisch eingebettet.
- Keine Datenbank, kein CMS in v1. Das Formular ist zustandslos: Request → Validierung → Mail.

## 5. HeroMedia-Abstraktion und Scroll-Architektur

Der Hero ist das zentrale Element. Eine einzelne Felge wird wie ein Premium-Produkt inszeniert, der Scrollfortschritt steuert den Ablauf:

```
beschädigte Felge → Reparatur beginnt → Oberfläche wird bearbeitet
→ Felge wird veredelt → fertige perfekte Felge → nächster Bereich
```

Der Hero wird währenddessen mit GSAP ScrollTrigger gepinnt und gescrubbt.

```
HeroMedia            gemeinsame Schnittstelle, nimmt progress: number
 ├── VideoSequence   steuert video.currentTime
 └── ImageSequence   wählt den Frame (hero-001.webp … hero-120.webp)
```

`Hero.tsx` darf nie wissen, welche Variante aktiv ist. **Die Entscheidung Video-Scrubbing vs. Image-Sequence fällt erst, wenn echtes Foto- und Videomaterial vorliegt** – bis dahin bleibt die Abstraktion bestehen und wird mit Platzhaltern entwickelt.

Zweite Scroll-Experience: die **Felgenveredelung-Section** wird ebenfalls gepinnt. Links die Leistungen `01 Pulverbeschichtung`, `02 Poliertechnik`, `03 Oberflächenveredelung`, `04 Vergoldung`, rechts das Visual. Beim Scrollen wechseln aktive Leistung, Bild und Beschreibung; danach verlässt die Seite den gepinnten Bereich.

Mobile übernimmt die Desktop-Experience **nicht** 1:1: kleinere Pin-Distanzen, reduzierte Animation, touchfreundlich. Bei `prefers-reduced-motion: reduce` werden aufwendige Animationen reduziert oder deaktiviert – die Inhalte müssen vollständig funktionieren.

## 6. Git-Workflow und aktueller Stand

```
Branch:  main  → origin/main, noch nicht gepusht
Remote:  origin  git@github.com:rsapo2903/felgenhotel.git
Letzter Phasen-Commit:  d7525b9  chore: bootstrap Next.js project
Darüber liegt der Commit mit diesem Handoff-Dokument.
```

Aktuellen Stand immer mit `git log --oneline | head -5` und `git status --short --branch` verifizieren.

Regeln: vorhandenes Repository verwenden, **kein erneutes `git init`**, `.git` nicht verändern, Remote nicht eigenmächtig ändern oder pushen ohne Rückfrage.

Vor **jedem** Commit die vollständige Prüfkette:

```bash
git diff            # und relevante Dateien lesen
npm run typecheck
npm run lint
npm run build
```

Kleine Commits nach abgeschlossenen Phasen, Conventional-Commit-Präfixe (`chore:`, `feat:`). Keine großen Sammel-Commits.

## 7. Bereits erledigt (Phase 0)

Projekt-Bootstrap: Next.js 16 mit leerem Template (kein Demo-Boilerplate, keine fremden Assets), TypeScript strict, Tailwind 4, ESLint, Prettier mit Tailwind-Klassensortierung, Verzeichnisstruktur, `data/site.ts`, `.env.example`, `.gitignore` mit `!.env.example`, `app/layout.tsx` mit `lang="de"` und Basis-Metadata, Scripts `typecheck` / `format` / `format:check`, Commit `d7525b9`.

Typecheck, Lint, Format-Check und Build liefen zu diesem Stand fehlerfrei.

## 8. Offene Entscheidungen

1. **Upload-Versand** – E-Mail-Anhang oder temporärer Storage mit Download-Link. Beide Varianten sind vor Phase 9 als Entscheidungsvorlage zu analysieren (Robustheit, Kosten, Größenlimits von Resend, Aufbewahrungsdauer). Noch nicht entschieden.
2. **Hero-Medium** – Video-Scrubbing oder Image-Sequence, entschieden nach Lieferung der echten Assets.
3. **Push nach `origin`** – der Bootstrap-Commit liegt lokal, der Nutzer wurde gefragt, noch keine Antwort.

## 9. Fehlende Assets und Inhalte

Werden vom Kunden später geliefert. Bis dahin **klar gekennzeichnete Platzhalter** in `public/assets/placeholders/`.

- **Logo** – darf nicht erfunden oder nachgebaut werden, nur Platzhalter in `public/assets/brand/`
- **Hero-Material** – Video oder Bildsequenz für den Ablauf beschädigt → veredelt
- **Fotos je Leistung**, Vorher/Nachher-Paare aus echten Kundenarbeiten, Galeriebilder, Werkstatt- und Porträtaufnahmen (Sezgin Öccetin, Maschinen, Hände bei der Arbeit)
- **Echte Google-Bewertungen** als Content – kuratiert, keine API in v1
- **Rechtliche Angaben** für Impressum und Datenschutz inkl. Rechtsform und USt-ID
- **Keys**: Turnstile Site/Secret Key, Resend API Key

Harte Regel: **nichts erfinden** – weder Bewertungen, Firmengeschichte, Zertifikate, Qualifikationen, Preise, Mitarbeiter noch rechtliche Angaben. Fehlendes wird als `TODO` markiert und im Phasenbericht aufgelistet. Keine Stockfotos, keine fremden Bilder, kein Hotlinking.

## 10. Constraints

**Design** – Motion muss kontrolliert und beabsichtigt wirken. Erlaubt: Scroll-Scrubbing, Pinning, Fade, Opacity, Scale, Mask Reveals, dezente Rotation, Parallax, Text-Transitions. Vermeiden: Bounce, Cartoon-Effekte, starke Blurs, Partikel, Dauerbewegung, unnötiges 3D. Keine Animation als Selbstzweck. Layout fluid, nicht nur Breakpoints.

**Performance** – Next.js Image Optimization, AVIF/WebP, responsive Größen, Lazy Loading, Code Splitting, dynamische Imports für schwere Komponenten. Hero darf die Seite nicht ausbremsen: Preload nur für tatsächlich benötigte Assets, GPU-freundliche Animationen, kein Layout Thrashing, Resize/Orientation sauber behandeln, GSAP-Contexts aufräumen. Keine unnötigen Dependencies oder Third-Party-Scripts.

**Accessibility** – semantisches HTML, korrekte Überschriftenhierarchie, Tastaturbedienung, sichtbare Focus States, ausreichender Kontrast, Alt-Texte, ARIA nur wo wirklich nötig, Reduced-Motion-Support.

**Security** – serverseitige Validierung aller Eingaben. Upload: maximal 10 Dateien, maximal 20 MB gesamt, JPG/JPEG/PNG/WEBP/HEIC/PDF, **tatsächlichen Dateityp am Inhalt prüfen** statt Endung oder Browser-MIME zu vertrauen, EXIF/GPS-Metadaten aus Bildern entfernen, nichts ausführbar speichern, keine unsicheren Dateinamen. Turnstile serverseitig bei jedem Request verifizieren, kein Token-Caching. Rate Limiting fürs Formular, sichere HTTP-Header, XSS- und CSRF-Schutz.

**SEO** – lokale Suchintentionen (Felgenreparatur Köln, Felgenveredelung Köln, Pulverbeschichtung Felgen Köln, Felgen richten Köln, Smart Repair Felgen Köln, Felgen lackieren Köln, Felgen polieren Köln). Metadata, Canonicals, Open Graph, sitemap.xml, robots.txt, JSON-LD mit LocalBusiness- und Service-Schema. Kein Keyword-Stuffing, natürliche Texte. Inhalte müssen auch ohne JavaScript im Markup stehen, damit der scroll-lastige Hero die Crawlbarkeit nicht beschädigt.

Vorzubereitende URL-Struktur: `/`, `/felgenreparatur`, `/felgenveredelung`, `/pulverbeschichtung`, `/poliertechnik`, `/smart-repair`, `/felgen-richten`, `/lackierung`, `/oberflaechenveredelung`, `/vergoldung`, `/galerie`, `/ueber-uns`, `/kontakt`, `/impressum`, `/datenschutz`. Kein Blog in v1, die Architektur soll spätere SEO-Landingpages erlauben.

**Consent** – keine nicht notwendigen externen Dienste vor erteiltem Consent laden, besonders Google Maps, Analytics und eingebettete Videos. Fonts sind durch `next/font` davon ausgenommen.

## 11. Nächster Schritt: Phase 1

Design Tokens, Fonts, globale Styles, Header und Footer:

- Farb- und Typografie-Tokens in `app/globals.css` als Tailwind-4-Theme, Spacing- und Größen-Skalen
- Space Grotesk und Inter über `next/font`
- Basis-Layout, Header (im Hero transparent, beim Scrollen dezent abgedunkelt, keine aggressive Sticky-Animation), Navigation `LEISTUNGEN / VORHER-NACHHER / GALERIE / ÜBER UNS / KONTAKT` plus CTA `REPARATUR ANFRAGEN`
- Mobile: Logo links, Hamburger rechts, Fullscreen-Navigation
- Footer mit Stammdaten aus `data/site.ts`
- Logo-Platzhalter, da das echte Logo noch fehlt

Danach Prüfkette, Commit `feat: add design system and layout`, Ergebnis zusammenfassen, **stoppen** und auf Freigabe für Phase 2 (Hero) warten.

Nach jeder Phase gilt: Code prüfen, TypeScript prüfen, Lint prüfen, Build prüfen, Fehler beheben, kurz erklären, nächste Phase vorschlagen und auf Bestätigung warten. Bei Entscheidungen, die Design oder Architektur erheblich beeinflussen und hier nicht beantwortet sind, nachfragen statt annehmen.
