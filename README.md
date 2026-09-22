# Felgenhotel

Website für Felgenhotel – Felgenreparatur und Felgenveredelung, Herler Straße 21, 51067 Köln.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS 4
- GSAP + ScrollTrigger für die scroll-gesteuerten Sektionen
- React Hook Form + Zod für das Anfrageformular
- Cloudflare Turnstile (Spam-Schutz), Resend (E-Mail-Versand)

## Entwicklung

```bash
npm run dev        # Dev-Server
npm run build      # Produktionsbuild
npm run typecheck  # TypeScript prüfen
npm run lint       # ESLint
```

Umgebungsvariablen: `.env.example` nach `.env.local` kopieren und ausfüllen.
Der Turnstile Secret Key und der Resend API Key werden ausschließlich serverseitig verwendet.

## Verzeichnisse

```
app/          Routen (App Router)
components/   UI-Komponenten nach Bereich gruppiert
data/         Inhaltsdaten (Stammdaten, Leistungen, Bewertungen)
lib/          Logik: GSAP-Setup, Validierung, Upload, Mail, Turnstile
public/assets Bilder und Videos (aktuell Platzhalter)
```

## Offene Assets und Inhalte

Noch nicht vorhanden, bis dahin klar gekennzeichnete Platzhalter:

- echtes Logo (`public/assets/brand/`)
- Hero-Material (Video oder Bildsequenz) für den Ablauf beschädigt → repariert → veredelt
- Fotos je Leistung, Vorher/Nachher-Paare, Galerie, Werkstatt- und Porträtaufnahmen
- echte Google-Bewertungen als Content
- rechtliche Angaben für Impressum und Datenschutz
