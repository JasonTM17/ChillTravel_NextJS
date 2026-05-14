# WanderViet — Features

## Booking System

### Tour Booking

- Browse and search tours with filters (destination, price, duration, category)
- Tour detail page with photo gallery, day-by-day itinerary, departure schedule
- Select departure date, guest count, apply coupon codes
- Multi-step booking flow: form → payment → confirmation
- Booking history with status tracking (PENDING, CONFIRMED, CANCELLED)

### Hotel Booking

- Hotel search with location, check-in/out dates, guest count
- Hotel detail with photo gallery (fullscreen with keyboard nav), amenity grid, room offers
- Price comparison across room types
- Sticky price summary on desktop, fixed CTA on mobile

### Flight Search

- One-way and round-trip search
- Filter by airline, stops, departure time
- Results sorted by price, duration, or departure time

---

## AI Features

All AI features run locally via Ollama LLM + Qdrant vector database. No cloud API keys required.

### AI Trip Planner (`/ai-planner`)

- Natural language trip planning: "Plan a 5-day trip to Da Nang for a family"
- Generates structured itineraries with daily activities, meals, accommodation
- Context-aware suggestions based on destination knowledge base

### AI Chat Assistant (`/chat`)

- Conversational travel consultation
- RAG-powered: retrieves relevant destination info from vector DB
- Streaming responses for real-time interaction
- Multilingual support (Vietnamese + English)

### Budget Estimator (`/budget`)

- Estimate trip costs based on destination, duration, travel style
- Breakdown by category: accommodation, food, transport, activities

### Travel Personality Quiz (`/personality`)

- Interactive quiz to determine travel style
- Personalized destination recommendations based on results

### Destination Comparison (`/compare`)

- Side-by-side comparison of multiple destinations
- AI-generated pros/cons and recommendations

### Mood-based Search

- Convert natural language mood ("I want somewhere relaxing by the beach") into search filters
- Returns matching destinations from the database

---

## User Management

### Authentication

- JWT-based auth with token rotation (15-min access + 7-day refresh)
- Email/password registration with email verification
- Password reset flow via email link
- Protected routes with AuthGuard component

### User Profile (`/profile`)

- Edit personal information (name, phone, avatar)
- View booking history
- Manage notification preferences

### Wishlist (`/wishlist`)

- Save tours and destinations
- Optimistic UI updates with rollback on failure

### Notifications (`/notifications`)

- In-app notification center
- Booking status updates, promotions, system alerts

### Loyalty Program (`/loyalty`)

- Points accumulation from bookings
- Tier system with benefits

---

## Admin Dashboard

### Analytics (`/admin/analytics`)

- Booking revenue charts
- User growth metrics
- Popular destinations and tours

### Content Management

- **Tours** (`/admin/tours`) — CRUD with itinerary builder, departure management
- **Hotels** (`/admin/hotels`) — Room types, pricing, amenities
- **Destinations** (`/admin/destinations`) — Geography, categories, images
- **Blogs** (`/admin/blogs`) — Rich text editor, publish/draft status
- **Coupons** (`/admin/coupons`) — Discount codes with usage limits and expiry

### User & Booking Management

- **Users** (`/admin/users`) — Role assignment, account status
- **Bookings** (`/admin/bookings`) — Status updates, guest details, payment tracking
- **Reviews** (`/admin/reviews`) — Moderation (approve/reject)
- **Contacts** (`/admin/contacts`) — Customer inquiry management

### AI Knowledge Base (`/admin/ai-knowledge`)

- Manage RAG documents for AI chatbot
- Import datasets, trigger reindexing

---

## Explore & Discovery

### Destination Search (`/explore`)

- Full-text search with category filters (Beach, Culture, Food, Mountain, Resort, Old Town)
- Sort by rating, name, newest
- Collapsible filter rail on mobile
- Responsive search grid with intermediate breakpoints

### Interactive Map (`/map`)

- Map-based destination discovery
- Cluster markers for dense areas

### Experiences (`/experiences`)

- Curated travel experiences and activities
- Category-based browsing

### Trip Planning (`/trips`)

- Save and organize trip itineraries
- AI-assisted trip building

---

## Technical Features

### Frontend (Next.js 16)

- React 19 with Server Components where applicable
- Custom design system with Tailwind CSS tokens (`tv-blue`, `tv-orange`, `tv-ink`, etc.)
- Mobile-first responsive design with proper breakpoints
- Image fallbacks with error handling
- Skeleton loading states for all data-fetching pages
- Error boundaries per route segment
- Internationalization support (Vietnamese primary, English secondary)

### Backend (NestJS 11)

- RESTful API with Swagger/OpenAPI auto-documentation
- Prisma ORM with PostgreSQL 18
- Redis caching for sessions and frequently accessed data
- Rate limiting on sensitive endpoints (auth, AI)
- File upload with path traversal protection
- Global exception filters and validation pipes
- Health check endpoints for Docker orchestration

### AI Service (FastAPI)

- Ollama integration for local LLM inference
- Qdrant vector database for RAG document retrieval
- Streaming responses via Server-Sent Events
- Knowledge base management with reindexing API
- 10 specialized endpoints for different AI tasks

### Mobile (Flutter)

- Cross-platform (iOS + Android) from single codebase
- 12 screens covering core booking and AI features
- Shared API contracts with web frontend

### Infrastructure

- Docker Compose with 6 services (postgres, redis, qdrant, api, web, ai)
- Multi-stage Docker builds for minimal image size
- Non-root containers for security
- Health checks on all services
- GitHub Actions CI/CD: lint → test → build → push images

### Testing

- **Unit tests** — Vitest for API services and utilities
- **E2E tests** — Playwright for critical user flows
- **Load tests** — k6 scripts for API performance validation
- **Type checking** — TypeScript strict mode across all packages

---

## Security

- JWT with short-lived access tokens and secure refresh rotation
- Rate limiting (Throttle decorator) on auth and AI endpoints
- Path traversal protection in file upload service
- Input validation via class-validator on all DTOs
- CORS configuration for allowed origins
- Non-root Docker containers
- No real payment processing (demo-only by design, documented in ADR-003)
