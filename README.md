# KhatamFlow - Adaptive Quran Tracker

An adaptive Quran tracker designed to solve "Ramadan Burnout" by dynamically recalculating daily reading goals based on remaining pages and days.

## ✨ Features

- **Adaptive Algorithm**: Daily pages automatically recalculate after every log
- **Local-First**: All data stored locally using IndexedDB
- **Offline-Capable**: 100% functional without internet
- **Low Friction**: Maximum 2 taps to log progress
- **Privacy-Focused**: No tracking, ads, or social features
- **PWA**: Installable as a Progressive Web App
- **OLED Dark Mode**: Pure black theme for battery savings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Usage

### First-Time Setup

1. Choose your Mushaf type (default: Madinah 604 pages)
2. Set your target completion date
3. Choose your starting page (default: page 1)

### Daily Usage

1. Read your assigned pages
2. Tap "✓ Finished Page X" to log progress
3. Watch your daily goal automatically adjust
4. Split reading across 5 daily prayers

## 🧮 The Algorithm

**Daily Pages = ⌈(Total Pages - Current Page) / Days Remaining⌉**

The core innovation is the adaptive recalculation that runs after every log:
- Behind schedule? Daily goal increases gradually
- Ahead of schedule? Daily goal decreases
- No dramatic spikes or impossible catches-ups
- Maghrib-based day calculation (Islamic day starts at sunset)

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand
- **Storage**: IndexedDB via `idb` library
- **PWA**: vite-plugin-pwa
- **Date Utils**: date-fns

## 📁 Project Structure

```
KhatamFlow/
├── src/
│   ├── core/
│   │   ├── algorithm/       # Core adaptive algorithm
│   │   └── storage/         # IndexedDB wrapper
│   ├── store/               # Zustand stores
│   ├── components/          # React components
│   ├── views/               # Main app views
│   ├── types/               # TypeScript definitions
│   └── assets/              # Styles and assets
├── public/                  # Static assets
└── dist/                    # Production build
```

## 🎯 Roadmap

### Phase 1: MVP ✅
- [x] Core adaptive algorithm
- [x] IndexedDB storage
- [x] Basic onboarding flow
- [x] Fast log button
- [x] Daily goal calculation

### Phase 2: Experience (In Progress)
- [x] Quran metadata (Surah/Juz/Ayah mapping)
- [x] Prayer-based goal splitting
- [x] History view with edit/delete
- [x] Completion projections
- [x] Dark mode toggle

### Phase 3: Polish
- [x] Local notifications
- [x] Progress charts
- [x] Data export (CSV)
- [x] Performance optimization
- [x] Cross-browser testing

## 🤲 Built For Ramadan 2026

Target release: Before Ramadan 2026

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built with the intention of making Quran reading during Ramadan more sustainable and stress-free.

"Indeed, this Quran guides to that which is most suitable" (Quran 17:9)
