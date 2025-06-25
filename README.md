# 📱 Popl Mobile Take-Home Project — Implementation Summary

This project implements the Popl lead management flow as specified in the take-home requirements. Below is how each requirement is satisfied, with references to the relevant files and components in the codebase.

## 🧠 Core Requirements Implemented

### 1. **Lead List Screen**

- **File:** [`screens/LeadListScreen.tsx`](./screens/LeadListScreen.tsx)
- Fetches and displays leads from mock API using React Query (`hooks/api.ts`)
- Search functionality with debouncing (`hooks/useDebounce.ts`)
- Sort by name or creation date via `FilterPopover` component
- Navigation to detail view on tap
- Loading states with skeleton components (`components/LeadCardSkeleton.tsx`)
- Error and empty states with fallback UI

### 2. **Lead Detail Screen**

- **File:** [`screens/LeadDetailScreen.tsx`](./screens/LeadDetailScreen.tsx)
- Displays complete lead information fetched by ID
- Tag management with add/remove functionality
- Notes editing with optimistic updates
- Delete functionality with confirmation
- Contact actions (call/email) with native integrations
- Loading state with detailed skeleton (`components/LeadDetailSkeleton.tsx`)

### 3. **New Lead Screen**

- **File:** [`screens/NewLeadScreen.tsx`](./screens/NewLeadScreen.tsx)
- Dynamic form generation from `/form-config` API endpoint (see [`hooks/api.ts`](./hooks/api.ts))
- Form validation with real-time error handling (`hooks/useFormState.ts`)
- Optimistic updates on submission
- Image picker integration for lead photos
- Modal presentation with proper navigation

## 🛠 Technical Implementation

### Code Architecture

- **API Layer:** [`hooks/api.ts`](./hooks/api.ts) - Centralized API calls and React Query hooks
- **State Management:** React Query for server state, Zustand for client state (`hooks/sessionStore.ts`)
- **Navigation:** [`navigation/index.tsx`](./navigation/index.tsx) - Proper React Navigation setup with TypeScript
- **Components:** Modular, reusable components in [`components/`](./components/)
- **Type Safety:** Complete TypeScript coverage with interfaces in [`types/index.ts`](./types/index.ts)

### Loading & Error Handling

- **Skeletons:** [`components/LeadCardSkeleton.tsx`](./components/LeadCardSkeleton.tsx), [`components/LeadDetailSkeleton.tsx`](./components/LeadDetailSkeleton.tsx)
- **Error States:** Graceful fallbacks with retry functionality in all screens
- **Empty States:** Contextual messaging and call-to-action buttons

## 💡 Optional Enhancements Completed

1. **🔧 Dynamic Form Support**

   - Form configuration loaded from `/form-config` endpoint via [`hooks/api.ts`](./hooks/api.ts)
   - Dynamic field rendering in [`components/Form.tsx`](./components/Form.tsx)
   - Validation rules applied from API configuration
   - Used in both New Lead and Edit Lead screens

2. **🧠 Enhanced Loading/Error UI**

   - Custom skeleton components for all loading states
   - Contextual error messages with retry options
   - Empty state designs with clear next actions

3. **🔍 Debounced Search**

   - [`hooks/useDebounce.ts`](./hooks/useDebounce.ts) prevents excessive API calls
   - 300ms delay for optimal UX performance

4. **🧪 Test Coverage**

   - Unit tests in [`tests/`](./tests/) covering components, hooks, and utilities
   - Jest configuration for React Native environment
   - Run all tests with `npm run test`

5. **🎨 Theme Toggle**

   - Users can toggle between light and dark themes via the settings or action bar (see `components/ChangeThemeAction.tsx`)
   - Theme preference is persisted across sessions

6. **📶 Offline Persistence**
   - Session state persisted to AsyncStorage via Zustand middleware
   - User preferences and authentication survive app restarts

## 🧪 Mock API Setup

```bash
npm run api  # Serves from http://localhost:3001/leads
```

## Known Limitations

- **Android Animation Crash:** Known `react-native-reanimated` issue with entering/exiting animations. See [GitHub issue #7493](https://github.com/software-mansion/react-native-reanimated/issues/7493#issuecomment-3002083686)
- **Keyboard Handling:** Some edge cases due to Expo Go limitations (cannot use `react-native-keyboard-controller`)
- **Static Skeletons:** No animated skeletons due to React 19 + Expo Go compatibility constraints

## Platform Support

- **iOS:** Fully tested and functional
- **Android:** Functional with noted animation limitation
