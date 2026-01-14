# TableMaster Frontend

Frontend application for TableMaster - Restaurant Administration Platform

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI:** React 18+
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Date Handling:** date-fns
- **Calendar:** FullCalendar

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see tablemaster-api README)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API URL
nano .env.local
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
# Build for production
npm run build

# Run production server
npm start

# Or use PM2
pm2 start ecosystem.config.js
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Auth group (login)
│   ├── admin/          # Admin pages
│   ├── dashboard/      # Restaurant dashboard
│   └── layout.tsx      # Root layout
├── components/
│   ├── ui/             # Shadcn/ui components
│   ├── auth/           # Auth components
│   ├── admin/          # Admin components
│   ├── dashboard/      # Dashboard components
│   ├── menus/          # Menu management components
│   ├── reservations/   # Reservation components
│   └── settings/       # Settings components
├── lib/
│   ├── api.ts          # API client
│   ├── auth.ts         # Auth utilities
│   └── utils.ts        # General utilities
├── store/
│   └── authStore.ts    # Zustand auth store
└── types/
    └── index.ts        # TypeScript types
```

## Environment Variables

See `.env.example` for required environment variables.

## Features

- JWT Authentication
- Admin Restaurant Management
- Restaurant Dashboard
- Menu Management (PDF & Detailed)
- Reservation Management
- Settings Management

## License

ISC
