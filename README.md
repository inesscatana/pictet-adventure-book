# Adventure Book - Interactive Storytelling Platform

An interactive adventure book platform where players embark on epic quests, make choices that shape their destiny, and experience multiple story paths. Built with React and Spring Boot.

## ✨ Features

### Game Features
- **Interactive Storytelling**: Navigate through branching narratives where every choice matters
- **Health System**: Manage your health points as consequences affect your journey
- **Progress Tracking**: Visual progress bar and section counter to track your adventure
- **Save & Resume**: Save your progress at any point and resume later
- **Multiple Endings**: Reach different endings based on your choices

### Library Features
- **Book Collection**: Browse a curated collection of adventure books
- **Search & Filter**: Search by title/author and filter by difficulty, type, and tags
- **Resume Games**: See which books have saved progress and resume where you left off
- **Book Details**: View summaries, difficulty levels, duration, and chapter counts

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hooks** for state management

### Backend
- **Spring Boot 3.5** with Java 21
- **Maven** for dependency management
- **SpringDoc OpenAPI** for API documentation
- **In-memory storage** for game progress (ConcurrentHashMap)

## 📋 Prerequisites

### Backend
- **JDK 21** - [Download](https://adoptium.net/en-GB/temurin/releases)
- **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)

### Frontend
- **Node.js** 18+ and npm

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-api
```

2. Start the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend-api
mvn clean package
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:
```
http://localhost:8080/service/swagger-ui/index.html
```

### Available Endpoints

- `GET /books` - Get all books summary
- `GET /books/{path}` - Get a specific book by path
- `POST /books/progress/save` - Save game progress
- `GET /books/progress/{bookPath}` - Get saved progress for a book
- `GET /books/progress` - List all saved progress

## 🎮 How to Play

1. **Browse the Library**: Start from the homepage to see all available adventure books
2. **Choose an Adventure**: Click "Begin Quest" on any book to start
3. **Make Choices**: Read the story and choose your path at decision points
4. **Manage Health**: Watch your health points as consequences affect it
5. **Save Progress**: Click "Save Progress" to save your current state
6. **Resume Later**: Return to the homepage and click "Resume Quest" on books with saved progress
7. **Start New**: Use "Start New" to begin a fresh adventure, ignoring saved progress

## 📁 Project Structure

```
pictet-adventure-book/
├── backend-api/          # Spring Boot backend
│   ├── src/
│   │   ├── main/java/    # Java source code
│   │   └── resources/    # JSON adventure books
│   └── pom.xml
├── frontend/             # React frontend
│   ├── src/
│   │   ├── features/     # Feature modules
│   │   │   ├── books/    # Library feature
│   │   │   └── game/     # Game feature
│   │   ├── ui/           # Shared UI components
│   │   └── api/          # API utilities
│   └── package.json
└── README.md
```

## 🎯 Key Features Implementation

### Game State Management
- Custom `useGameState` hook manages game logic, health, and progress
- Automatic loading of saved progress on game start
- Support for starting new games with `?new=true` query parameter

### Save/Resume System
- Backend stores progress in-memory (section ID, health, timestamp)
- Frontend automatically loads saved progress when available
- Homepage displays "Resume Quest" button for books with saved progress

### Health System
- Initial health: 100 HP
- Consequences can gain or lose health
- Visual health chip with color-coded states (green/orange/red)

### Progress Tracking
- Progress bar showing completion percentage
- Section counter (e.g., "Section 5 of 17")
- Automatically shows 100% when reaching END sections

## 🛠️ Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Component-based architecture
- Separation of concerns (hooks, components, utils)

### Architecture Patterns
- **Container/Presentational Pattern**: Logic separated from UI
- **Custom Hooks**: Reusable business logic
- **React Query**: Server state management
- **Functional Components**: Modern React patterns
