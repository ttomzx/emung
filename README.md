# ꯏꯃꯨꯡ (Emung) - Static Family Heritage Platform

A modern, dynamic static web application built to preserve family history, tree lineage, oral stories, photo memories, and family events.

## Features
- **Visual Family Tree**: Interactive ancestry canvas built dynamically from parent-child relationships.
- **Family Directory**: Full listing of family members across generations with rich profiles and search filters.
- **Oral Traditions**: Preserve ancestral stories and legends with audio narration support.
- **Photo Vault**: Share photo memories with category filtering and interactive lightboxes.
- **Milestones & Events**: Track upcoming reunions, festivals, birthdays, and RSVPs.
- **Role-Based Access Control**: Built-in Admin (`admin@emung.org` / `admin123`) and Member (`member@emung.org` / `member123`) authorization matrix.
- **Static Storage**: Powered by local data (`src/data/mockFamily.js`) and `localStorage` persistence.

## Project Structure
- `frontend/` - Modern React & Vite web application
- `backend/` - Node.js, Express & MongoDB API server

## Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Development Servers
Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
npm run dev:frontend
npm run dev:backend
```

### 3. Build for Production
```bash
npm run build
```
The output will be generated in `frontend/dist`, ready to deploy to GitHub Pages, Vercel, Netlify, or Cloudflare Pages!
