# Design — Gonotelm Web

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

/* Hallmark · pre-emit critique: P4 H4 E4 S4 R5 V4 */

## Genre
editorial

## Macrostructure family
- Marketing pages (Home): Workbench-lite — cream paper, hairline cards, forest accent signal
- App pages (Notebook workspace): Workbench — three panels share tokens; no enrichment
- Content pages: n/a

## Theme
Studio (light · high-contrast-serif · forest-green)

- `--color-paper`      oklch(97% 0.012 90)
- `--color-paper-2`    oklch(94% 0.014 90)
- `--color-paper-3`    oklch(91% 0.016 90)
- `--color-ink`        oklch(20% 0.02 145)
- `--color-ink-2`      oklch(36% 0.018 145)
- `--color-rule`       oklch(86% 0.016 95)
- `--color-accent`     oklch(42% 0.11 150)   /* forest-green · ≤ ~5% viewport */
- `--color-accent-ink` oklch(98% 0.01 90)
- `--color-focus`      oklch(42% 0.11 150)

## Typography
- UI (all app chrome / Chinese copy): Geist 400/500/600 + Noto Sans SC / system CJK
- Display accent (Latin-only moments): Instrument Serif 400 roman — **do not** set on CJK titles
- Mono: JetBrains Mono — **code blocks only**, never notebook meta / captions
- Letter-spacing: `0` on UI text (negative tracking breaks CJK rhythm)
- Type scale anchor: workspace 12 / 14 / 18 / 20 px

## Spacing
4-point named scale via MUI spacing (8px base) + `layoutTokens`.

## Motion
- Easings: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1)
- Reveal: quiet fade / opacity; no bounce, no card lift spam
- Hover: forest border / soft wash; reduced-motion ≤ 150ms opacity

## Microinteractions stance
- silent success
- hover delay 800 ms · focus delay 0 ms
- primary button: solid forest fill, 8px radius, no gradient pill

## CTA voice
- Primary CTA: forest fill, cream ink
- Secondary CTA: hairline outline + ink
- Copy: specific, restrained, slightly literary Chinese; no emoji ornament

## Per-page allowances
- Home MAY use hairline card grid + sparse forest accents
- App pages MUST NOT use enrichment / multi-accent floods
- Accent footprint stays small (signal, not flood)

## What pages MUST share
- Warm cream paper + forest accent
- Instrument Serif (display) + Geist (body) + JetBrains Mono
- Hairline borders over heavy shadows
- Quiet motion

## What pages MAY differ on
- Status hues for artifact states (cool-biased greens/ambers)
- Code surfaces may use slightly cooler ink wash

## Workspace semantic tones (Studio)
Per-type accents live in `workspaceColorPalette.artifactKind` / `sourceType`.
They must stay quiet on cream paper (surface ~8% alpha); never Hum-loud multi-accent floods.

| Kind | Role hue |
|---|---|
| mindmap | forest (brand) |
| report | olive |
| info_graphic | teal |
| audio_overview | slate-ink |
| flashcard | brass |
| quiz | terracotta |
| data_table | blue-slate |
| note | sage |
| source pdf / url / xlsx… | matching quiet chroma + **Outlined** icons |

## Audience / use case / tone
- Audience: general notebook + AI workspace users
- Use case: Home → create/open notebook → Sources / Chat / Studio
- Tone: editorial · Studio · calm · light · forest signal

## Exports

### tokens.css
See project-root `tokens.css`.

### Tailwind v4 `@theme`
```css
@theme {
  --color-paper:   oklch(97% 0.012 90);
  --color-ink:     oklch(20% 0.02 145);
  --color-accent:  oklch(42% 0.11 150);
  --font-display:  "Instrument Serif", serif;
  --font-body:     "Geist", "Noto Sans SC", sans-serif;
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
}
```

### DTCG `tokens.json`
```json
{
  "color": {
    "paper":  { "$value": "oklch(97% 0.012 90)", "$type": "color" },
    "ink":    { "$value": "oklch(20% 0.02 145)", "$type": "color" },
    "accent": { "$value": "oklch(42% 0.11 150)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Instrument Serif", "$type": "fontFamily" },
    "body":    { "$value": "Geist", "$type": "fontFamily" }
  }
}
```

### shadcn/ui CSS variables
```css
:root {
  --background:         97% 0.012 90;
  --foreground:         20% 0.02 145;
  --primary:            42% 0.11 150;
  --primary-foreground: 98% 0.01 90;
  --muted:              86% 0.016 95;
  --muted-foreground:   36% 0.018 145;
  --border:             86% 0.016 95;
  --ring:               42% 0.11 150;
  --radius:             8px;
}
```
