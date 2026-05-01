# WIRED TOKYO Event Platform

A multi-project monorepo containing three independent applications for WIRED TOKYO event management and digital experience.

## Project Structure

### `/a-la-page`
À LA PAGE - Digital Third Space Website for TSUTAYA BOOKSTORE × WIRED TOKYO

- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Purpose**: Magazine-style digital platform showcasing monthly events, stories, and collaboration opportunities
- **Status**: Production-ready
- **Start Development**: `cd a-la-page && npm run dev`

Key Features:
- Monthly magazine-style homepage with editorial content
- Event discovery and detail pages
- Store information and activities
- Collaboration request form
- Contact information

### `/daffy-queue`
Queue management system for event venues

- **Tech Stack**: HTML/JavaScript + Firebase Realtime Database
- **Purpose**: Real-time queue management for Daffy POPUP portrait drawing event
- **Features**: 
  - Customer display page (auto-refresh, real-time updates)
  - Staff admin panel (password-gated, +1/skip controls)
  - Event display board (rotated for sideways TV mounting)
- **Status**: Production-ready
- **Deployment**: Vercel (root directory: `daffy-queue`)
- **Start Development**: 
  ```bash
  python3 -m http.server 8000
  # Open http://localhost:8000/
  ```
- **Configuration**: Edit `assets/config.js` with Firebase credentials and staff password
- **Pre-Event Setup**: See `daffy-queue/SETUP.md` for complete deployment checklist

### `/taichung-8th-anniversary`
Taichung location 8th anniversary celebration website

- **Tech Stack**: Next.js, React, TypeScript
- **Purpose**: Special event website for location milestone celebration
- **Documentation**: See `CLAUDE.md` and `OPERATION_MANUAL.md` in project directory

## Getting Started

### For À LA PAGE Development
```bash
cd a-la-page
npm install
npm run dev  # Start development server on localhost:3000
```

### For Production Build
```bash
cd a-la-page
npm run build
npm run start
```

### Deployment
All projects are configured for Vercel deployment. Push changes to the respective branches and Vercel will automatically build and deploy.

## Development Branch
Current development work is on: `develop/a-la-page`

## Project Dependencies
- À LA PAGE requires Node.js 18+ and npm/yarn
- daffy-queue and taichung-8th-anniversary each have their own environment requirements (see respective project READMEs)

## Documentation
- À LA PAGE Design System: See components and design tokens in `a-la-page/tailwind.config.ts`
- API/Data Structures: See `a-la-page/lib/types.ts`
- Mock Data: `a-la-page/lib/mockData.ts`

## Recent Changes
- Migrated À LA PAGE to subdirectory for clean monorepo structure (v1.0)
- All 8 development phases completed
- Ready for production deployment
