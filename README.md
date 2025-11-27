# TogetherCal

A family calendar app built with React Native and Expo that keeps everyone in sync without compromising privacy.

## Features

- **Family Calendar Sync** - Share events with family members while keeping personal details private
- **Smart Privacy Controls** - Choose what to share: full details, busy-only, or keep private
- **Event Approvals** - Parents can approve events created by children
- **Multi-Calendar Support** - Connect Google Calendar, Outlook, and CalDAV providers
- **Push Notifications** - Get reminders and approval requests
- **Offline Support** - Works without internet, syncs when connected

## Tech Stack

- **Framework**: React Native 0.74.5 with Expo 51
- **Navigation**: React Navigation 6
- **State Management**: Zustand with persist middleware
- **Data Fetching**: TanStack React Query
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Authentication**: Email/Password, Apple Sign In, Google/Outlook OAuth
- **Testing**: Jest (unit), Detox (E2E)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.15.0
- Xcode 15+ (for iOS development)
- iOS Simulator or physical device

### Installation

```bash
# Clone the repository
git clone https://github.com/bheemreddy-samsara/iOSApp.git
cd iOSApp

# Install dependencies
pnpm install

# Install iOS pods
cd ios && pod install && cd ..
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_OUTLOOK_CLIENT_ID=your_outlook_client_id
```

### Running the App

```bash
# Start Metro bundler
pnpm dev

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run in watch mode
pnpm test --watch
```

### E2E Tests

```bash
# Build the app for E2E testing
pnpm exec detox build --configuration ios.release

# Run E2E tests
pnpm exec detox test --configuration ios.release
```

### Type Checking & Linting

```bash
# TypeScript type check
pnpm typecheck

# ESLint
pnpm lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── data/            # Sample/demo data
├── hooks/           # React Query hooks
├── navigation/      # Navigation configuration
├── repositories/    # Data access layer
├── screens/         # Screen components
├── services/        # External service integrations
├── state/           # Zustand stores
├── supabase/        # Supabase types
├── theme/           # Design tokens and theming
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

tests/
├── unit/            # Jest unit tests
e2e/
└── *.e2e.ts         # Detox E2E tests
```

## Architecture

### Data Flow

```
Screen → Hook (React Query) → Repository → Supabase
                ↓
            Zustand Store (local cache)
```

### Key Patterns

- **Repository Pattern**: Data access abstracted through repositories
- **React Query**: Server state management with caching
- **Zustand**: Client state with persistence
- **Error Boundary**: Graceful error handling

## App Store Submission

### Requirements Checklist

- [x] Apple Sign In (required when offering social login)
- [x] Privacy Policy screen
- [x] Terms of Service screen
- [x] App icons and splash screen
- [x] iOS entitlements configured
- [x] Push notification support

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production
```

## CI/CD

The project includes GitHub Actions workflows:

- **CI** (`ci.yml`): Runs on every PR
  - TypeScript type checking
  - ESLint
  - Unit tests
  - E2E tests (iOS)

- **Droid Review** (`review-droid.yml`): AI-powered code review on PRs

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `pnpm test && pnpm typecheck`
4. Commit with conventional commits: `git commit -m "feat: add feature"`
5. Push and create a PR

## License

Private - All rights reserved

## Support

For issues or questions, please open a GitHub issue.
