# TogetherCal Design Tokens

## Palette
- Mist Indigo `#5E6AD2`
- Soft Lilac `#D5DAFF`
- Peach Glow `#FF9F80`
- Meadow Green `#48B27F`
- Honey Amber `#F5A35C`
- Coral Alert `#F16667`
- Cloud Base `#F7F7FB`
- Snow Surface `#FFFFFF`
- Haze Surface `#F0F1F7`
- Ink Primary `#1C1E26`
- Slate Secondary `#5B6270`
- Silver Border `#E0E3F0`
- Category Blue `#7BC7FF`
- Category Pink `#FF92C2`
- Category Teal `#58D0C9`
- Category Yellow `#FFE177`

## Typography (SF Pro)
- Display (700/44) — hero date on Today screen
- Title (600/32) — screen headers
- Headline (600/24) — section headers, cards
- Body (400/18) — primary copy
- Callout (500/16) — controls, segmented labels
- Footnote (500/14) — meta info, timestamps
- Caption (400/12) — supporting labels

## Spacing Scale
`0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48`

## Radii
- `xs: 8`
- `sm: 12`
- `md: 16`
- `lg: 24`
- `xl: 32`
- `pill: 999`

## Shadows
- `soft` — `0 4 12 rgba(94,106,210,0.12)`
- `elevated` — `0 10 24 rgba(25,32,72,0.18)`
- `modal` — `0 24 48 rgba(12,16,44,0.24)`

## Motion
- `spring: { stiffness: 160, damping: 20 }`
- `durationFast: 150ms`
- `durationBase: 250ms`
- `durationSlow: 400ms`

## Accessibility
- Minimum contrast WCAG AA; dark text on light surfaces.
- Typography respects Dynamic Type scaling via React Native `Text` props.
- Shadows soften but maintain contrast using layered surfaces.
