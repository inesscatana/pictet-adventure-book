# Adventure Book - Frontend

React-based frontend for the Adventure Book interactive storytelling platform. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API utilities
│   │   └── http.ts       # HTTP client wrapper
│   ├── app/              # App-level configuration
│   │   ├── providers.tsx # React Query and Router providers
│   │   └── router.tsx    # React Router configuration
│   ├── features/         # Feature modules
│   │   ├── books/        # Library feature
│   │   │   ├── api.ts    # Books API functions
│   │   │   ├── hooks.ts  # Custom hooks (useBooks, useBookFilters, useSavedProgress)
│   │   │   ├── types.ts  # TypeScript types
│   │   │   ├── utils.ts  # Utility functions
│   │   │   ├── HomePage.tsx
│   │   │   └── components/
│   │   │       ├── BookCard.tsx
│   │   │       ├── BookGrid.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ErrorState.tsx
│   │   │       ├── FilterBar.tsx
│   │   │       ├── HeroSection.tsx
│   │   │       ├── LibraryHeader.tsx
│   │   │       ├── LibrarySection.tsx
│   │   │       ├── LoadingState.tsx
│   │   │       └── SearchInput.tsx
│   │   └── game/         # Game feature
│   │       ├── api.ts    # Game API functions (saveProgress, getProgress, etc.)
│   │       ├── hooks.ts  # Custom hooks (useBook, useGameState)
│   │       ├── types.ts  # TypeScript types
│   │       ├── utils.ts  # Game utilities (health, progress, consequences)
│   │       ├── GamePage.tsx
│   │       └── components/
│   │           ├── GameEndScreen.tsx
│   │           ├── HealthChip.tsx
│   │           ├── ProgressBar.tsx
│   │           └── SectionCounter.tsx
│   ├── ui/               # Shared UI components
│   │   ├── Chip.tsx      # Reusable chip component
│   │   ├── Icon.tsx      # Icon component wrapper
│   │   └── icons.ts      # Icon definitions
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🏗️ Architecture

### Feature-Based Structure
The application is organized by features (`books` and `game`), each containing:
- **API functions** - Data fetching logic
- **Hooks** - Custom React hooks for state management
- **Components** - UI components specific to the feature
- **Types** - TypeScript type definitions
- **Utils** - Utility functions

### Architecture Patterns

#### Container/Presentational Pattern
- **Container components** (e.g., `HomePage`, `GamePage`) manage state and logic
- **Presentational components** (e.g., `BookCard`, `HealthChip`) focus on UI rendering

#### Custom Hooks
- `useBooks()` - Fetches and manages book list
- `useBookFilters()` - Handles search and filter logic
- `useSavedProgress()` - Fetches saved game progress
- `useBook()` - Fetches a specific book
- `useGameState()` - Manages game state, health, progress, and save/resume

#### State Management
- **React Query** (`@tanstack/react-query`) for server state
- **React Hooks** (`useState`, `useEffect`, `useMemo`, `useCallback`) for local state
- **React Router** for navigation and URL state

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS 4 for styling with a custom color palette:
- Primary brown tones: `#2b1f17`, `#4a352a`, `#6b5647`
- Background: `#fbf7f2`, `#fffaf4`
- Accent: `#c88c1e`, `#b47714`
- Borders: `#ead8c6`

### Component Styling
- Consistent rounded corners (`rounded-xl`, `rounded-2xl`)
- Shadow utilities for depth
- Responsive design with Tailwind breakpoints
- Hover states and transitions

## 🔧 Key Technologies

### Core
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & Data
- **React Router 7** - Client-side routing
- **TanStack Query 5** - Server state management and caching

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Development
- **ESLint** - Code linting
- **TypeScript ESLint** - Type-aware linting rules

## 📦 Dependencies

### Production
- `react` & `react-dom` - React framework
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching and caching
- `@tailwindcss/postcss` - Tailwind CSS

### Development
- `vite` - Build tool
- `typescript` - TypeScript compiler
- `eslint` - Linting
- `@vitejs/plugin-react` - Vite React plugin

## 🎯 Features

### Library Feature (`features/books/`)
- Book listing with search and filters
- Book cards with metadata (difficulty, type, duration, chapters)
- Resume functionality for saved games
- Empty, loading, and error states

### Game Feature (`features/game/`)
- Interactive story navigation
- Health point management
- Progress tracking (progress bar and section counter)
- Save and resume game progress
- Game end screen (victory/defeat)
- Consequence handling (health gains/losses)

## 🔌 API Integration

### API Configuration
The frontend communicates with the backend API through:
- Base URL: `/service` (configurable via `VITE_API_PREFIX` env variable)
- HTTP client wrapper in `src/api/http.ts`

### API Functions

**Books API** (`features/books/api.ts`):
- `getBooks()` - Fetch all books

**Game API** (`features/game/api.ts`):
- `getBook(path)` - Fetch a specific book
- `saveProgress(bookPath, sectionId, health)` - Save game progress
- `getProgress(bookPath)` - Get saved progress (returns null if not found)
- `listProgress()` - List all saved progress

## 🧩 Component Library

### Shared UI Components (`src/ui/`)
- **Icon** - Icon component with accessibility support
- **Chip** - Reusable chip/badge component

### Feature Components
Each feature has its own component directory with specialized components following the single responsibility principle.

## 🛠️ Development Guidelines

### Code Organization
- Keep feature code in `features/` directory
- Shared utilities in `ui/` or feature-specific `utils.ts`
- API functions separate from components
- Custom hooks for reusable logic

### TypeScript
- Strict type checking enabled
- All components and functions are typed
- Types defined in `types.ts` files

### Component Best Practices
- Functional components with hooks
- Props typed with TypeScript interfaces
- Accessibility attributes where appropriate
- Responsive design considerations

### State Management
- Use React Query for server state
- Use React hooks for local component state
- Extract complex logic into custom hooks
- Memoize expensive computations with `useMemo`

## 🚀 Building for Production

```bash
npm run build
```

This will:
1. Type-check the codebase (`tsc -b`)
2. Build optimized production bundle (`vite build`)
3. Output to `dist/` directory

The production build is optimized with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

## 🔍 Environment Variables

Create a `.env` file in the frontend directory to configure:

```env
VITE_API_PREFIX=/service
```

Default is `/service` if not specified.

## 📝 Notes

- The application uses React 19 features
- TypeScript strict mode is enabled
- All API calls are handled through React Query for caching and error handling
- The UI is fully responsive and accessible
