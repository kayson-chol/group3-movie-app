# Group 3 Movie App — Software Design & Architecture

## Architecture chosen

The project now uses a **feature-based architecture with layered separation of concerns**.

- **`src/app/`** contains Expo Router route adapters. Routes are intentionally thin and delegate the UI to feature screens.
- **`src/features/`** groups code by business feature rather than by one large global folder.
- **Screens** handle presentation and user interaction.
- **Hooks** handle component state and application logic such as loading, searching, and fetching.
- **Services** handle communication with TMDB.
- **Components** contain reusable UI for a feature.
- **Types** define the data contracts used by the feature.
- **`src/config/`** contains environment/API configuration.

## Why this architecture?

### 1. Separation of concerns
A screen no longer owns API-fetching logic. For example, Home uses `usePopularMovies()`, while that hook uses the TMDB service.

### 2. Reusability
`MovieCard` is a feature component reused by Home and Search. Cast rendering is similarly isolated in `CastCard`.

### 3. Maintainability
TMDB request details are centralized in `features/movies/services/movieApi.ts`. Changes to endpoints or request handling can be made in one place.

### 4. Scalability
New movie features such as Trending, Recommendations, Watchlist, or Genres can be added without turning the route files into large mixed-responsibility files.

### 5. Team collaboration
Feature ownership is clearer. Different group members can work on movies, cast, search, or another feature with less overlap.

### 6. Safer state management
Custom hooks keep loading, error, and data state close to the feature while preventing that state logic from cluttering the screen component.

## Before → After

### Before
`app/index.tsx` mixed UI, API calls, state, effects, and navigation. There was also an obsolete duplicate `src/screens/HomeScreen.tsx`.

### After
`app/index.tsx` is only a route adapter. The Home screen is in `features/movies/screens/HomeScreen.tsx`, its state/fetch logic is in `features/movies/hooks/usePopularMovies.ts`, and TMDB access is in `features/movies/services/movieApi.ts`.

## Request flow

```text
Expo Router route
      ↓
Feature Screen
      ↓
Custom Hook
      ↓
Feature Service
      ↓
TMDB API
```

For reusable presentation:

```text
Feature Screen
      ↓
Reusable Feature Component
```
