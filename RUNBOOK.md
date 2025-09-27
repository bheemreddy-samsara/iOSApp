# TogetherCal Runbook

## 1. Prerequisites
- Node.js 18+
- pnpm 8.x (preferred) or Bun 1.0+
- Expo CLI (local via `pnpm expo` or `bunx expo`)
- Supabase project (create via dashboard)

## 2. Environment Variables
Create `.env` with:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EXPO_PUBLIC_OUTLOOK_CLIENT_ID=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=
```

## 3. Install Dependencies
```
pnpm install
```
_or_
```
bun install
```

## 4. Development
```
pnpm dev
```
_or_
```
bun run dev
```

iOS build:
```
pnpm ios
```
_or_
```
bunx expo run:ios
```

## 5. Testing & Quality
```
pnpm test       # unit tests (Vitest)
pnpm lint       # eslint
pnpm typecheck  # TypeScript
pnpm e2e        # Detox (ensure iOS simulator running)
```
Equivalent Bun commands:
```
bun run test
bun run lint
bun run typecheck
bun run e2e
```

## 6. Supabase Setup
1. Run SQL migrations:
   - Upload `sql/01_schema.sql` in Supabase SQL editor and execute.
2. Deploy Edge Functions:
   - `pnpm exec supabase functions deploy conflict-alerts`
   - `pnpm exec supabase functions deploy reminder-dispatch`
   - _or_ `bunx supabase functions deploy conflict-alerts`
3. Seed demo data (optional):
   - `pnpm exec ts-node scripts/seed.ts`
   - _or_ `bunx ts-node scripts/seed.ts`

## 7. Privacy Safeguards Checklist
- `work-import` events stored with `privacyMode='busy-only'` and rendered as `Title - Busy`.
- RLS blocks cross-family access; only owner/admin can mutate calendars.
- Edge functions intentionally avoid mutating external providers.
- Use Supabase service role key only in backend contexts.
- Run `pnpm lint` before release to ensure no `console.log` of private data.

## 8. Production Build Notes
- Use Expo EAS for signing; ensure `app.json` bundle identifiers updated.
- Configure Expo push notification credentials for iOS.
- Verify Dynamic Type, VoiceOver, and Reduced Motion using iOS Accessibility Inspector.

## 9. Deployment Checklist
- `pnpm test && pnpm lint && pnpm typecheck`
- `pnpm ios --configuration Release`
- Tag release and attach Supabase migration hash.
