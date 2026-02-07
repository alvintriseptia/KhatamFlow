# KhatamFlow - Quick Start Guide

## 🎉 Phase 1 MVP is Complete!

Your adaptive Quran tracker is now functional with all core features working.

## 🚀 Running the App

### Development Mode
```bash
npm run dev
```
Then open http://localhost:5173 in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## ✅ What's Working Now

### 1. Onboarding Flow
- Select Mushaf type (Madinah 604 pages)
- Set target date with quick selects (30/60/90 days)
- Choose starting page (default: page 1)
- Beautiful 3-step progress indicator

### 2. Dashboard
- **Today's Goal Card**: Shows daily pages needed
- **Resume Card**: Next page to read with progress percentage
- **Fast Log Button**: One-tap progress logging ("✓ Finished Page X")
- **Prayer Splitter**: Divides daily goal across 5 prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **Statistics**: Pages remaining, days remaining

### 3. Core Features
- **Adaptive Algorithm**: Goal recalculates after every log
- **Local Storage**: All data persists in IndexedDB
- **Offline First**: Works without internet
- **OLED Dark Mode**: Pure black theme for battery savings
- **PWA Ready**: Can be installed as an app

## 🧪 Testing the App

### Manual Test Flow
1. **First Visit**
   - You'll see the onboarding screen
   - Select "Madinah Mushaf (604 pages)"
   - Click "Continue"

2. **Set Goal**
   - Choose a target date (try "30 Days" quick select)
   - Click "Continue"

3. **Starting Page**
   - Leave at page 1 or choose a different starting page
   - Click "Start Reading"

4. **Dashboard**
   - You should see: "Today's Goal: 21 pages" (for 30-day goal)
   - Resume card shows "Page 1 of 604"
   - Prayer breakdown shows how to split 21 pages

5. **Log Progress**
   - Click "✓ Finished Page 1"
   - Goal recalculates: (604 - 1) / 29 = ~21 pages
   - Resume card updates to "Page 2 of 604"
   - Progress bar increases

6. **Test Adaptive Behavior**
   - Log multiple pages quickly
   - Watch the daily goal adjust
   - The algorithm formula: ⌈(604 - currentPage) / daysRemaining⌉

## 🔍 Key Files to Understand

### Core Algorithm
- `src/core/algorithm/calculator.ts` - The heart of KhatamFlow
- `src/core/algorithm/dateUtils.ts` - Maghrib-based day calculations

### State Management
- `src/store/progressStore.ts` - All app state and actions
- `src/store/settingsStore.ts` - Theme and settings

### Storage
- `src/core/storage/db.ts` - IndexedDB operations
- `src/core/storage/localStorage.ts` - Fallback storage

### Main Views
- `src/views/Onboarding.tsx` - First-time setup
- `src/views/Dashboard.tsx` - Main app screen

### Key Components
- `src/components/dashboard/FastLogButton.tsx` - The most important UI element
- `src/components/dashboard/TodayView.tsx` - Daily goal display
- `src/components/dashboard/PrayerSplitter.tsx` - 5-prayer breakdown

## 🎨 Customization

### Theme
The app uses CSS custom properties. Edit `src/assets/styles/themes.css`:
- `--accent`: Main accent color (default: #10b981 green)
- `--bg-primary`: Background color (default: #000000 for OLED)

### Maghrib Time
Currently hardcoded to 18:00 (6 PM). In Phase 2, this will be customizable in settings.

## 🐛 Known Limitations (Phase 1)

- No Quran metadata yet (Surah/Juz names not showing in Resume Card)
- No history view (can't see or edit past logs)
- No completion projections (no "you'll finish on X date" estimates)
- No settings page (can't toggle theme or change Maghrib time)
- No app icons yet (will add in Phase 3)

## 📊 Data Storage

All data is stored in IndexedDB under the database name `khatamflow-db`:
- **goal**: Your target date and Mushaf settings
- **progress**: Current page and total pages read
- **logs**: All your reading logs (with timestamps)
- **dailyGoal**: Calculated daily pages needed
- **settings**: Theme and Maghrib time

### Inspecting Data
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "IndexedDB" → "khatamflow-db"
4. Explore the stores to see your data

### Clearing Data
To reset the app (for testing):
1. DevTools → Application → IndexedDB
2. Right-click "khatamflow-db" → Delete database
3. Refresh the page → Onboarding will appear again

## 🚀 Next Steps

### Phase 2 Implementation
1. **Quran Metadata** - Add 604-page JSON with Surah/Juz mapping
2. **History View** - Show all logs with edit/delete functionality
3. **Projections** - Calculate and display completion estimates
4. **Settings Page** - Theme toggle, Maghrib time, reset button

### Phase 3 Polish
1. Create app icons (192x192, 512x512)
2. Add local notifications
3. Implement progress charts
4. Data export to CSV
5. Performance optimization
6. Cross-browser testing

## 💡 Tips

### For Development
- Hot reload works automatically (Vite)
- Check console for any errors
- Use React DevTools to inspect component state
- IndexedDB operations are async - use DevTools to verify data

### For Testing
- Test on both desktop and mobile browsers
- Try different target dates (1 day, 7 days, 30 days, 90 days)
- Test edge cases: start from page 300, log multiple pages at once
- Test the Maghrib boundary: change system time to 5:59 PM vs 6:01 PM

## 🎯 Success Criteria Checklist

- [x] User can set a goal (target date, Mushaf type)
- [x] User can log progress with 1 tap
- [x] Daily goal recalculates automatically
- [x] Data persists locally (survives refresh)
- [x] Prayer-based splitting works
- [x] Progress percentage displays correctly
- [x] App works offline
- [x] Dark mode enabled by default

## 📞 Need Help?

Check these files:
- `README.md` - Project overview
- `IMPLEMENTATION_STATUS.md` - Detailed feature status
- `PRD.md` - Original product requirements

## 🎉 You're Ready!

The MVP is complete and ready for real-world testing. Run `npm run dev` and start tracking your Quran reading!

**Next goal**: Add Quran metadata so you can see Surah names and Juz numbers.
