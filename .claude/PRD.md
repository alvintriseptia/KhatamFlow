📖 PRD: KhatamFlow (Adaptive Quran Tracker)

    Tagline: Don't just track your reading—let your schedule adapt to your life.

1. Project Overview

KhatamFlow is a utility-first application designed to solve the "Ramadan Burnout." Most trackers are static and discouraging when a user falls behind. KhatamFlow uses an adaptive algorithm to recalculate goals in real-time, ensuring the user always has a manageable path to their Khatam (completion).

    Objective: Provide a guilt-free, high-utility reading assistant.

    Target Release: Ramadan 2026.

    Success Metric: User reaches the final page (604) by their target date.

2. The Core Algorithm

The "Magic" of the app lies in its ability to redistribute the workload. Instead of a fixed page count, the app runs this calculation after every log:
Pdaily​=⌈Dremaining​Ptotal​−Pcurrent​​⌉

    Ptotal​: Total pages in the user's specific Mushaf (Default: 604).

    Pcurrent​: The last page the user confirmed finishing.

    Dremaining​: Days left until the user's set target date.

3. Feature Specifications
3.1 Onboarding & Customization
Feature	Description
Mushaf Selection	Choose between Madinah (604 pages), Indo-Pak, or Custom page counts.
Dynamic Goal	Set a target end date (e.g., 27th night of Ramadan).
Manual Start	Option to start from any page (for those beginning mid-month).
3.2 The "Smart" Dashboard

    The Resume Card: Displays "Next: Page X" along with the Surah name and Juz.

    The Today View: Shows how many pages are needed today and how many are remaining to reach the end.

    The Prayer Splitter: Breaks the daily goal into 5 small segments (e.g., "4 pages after each Salah").

3.3 Progress Management

    Fast-Log Button: A "I finished this page" button that updates the pointer with one tap.

    History Logs: Edit past entries in case of a mistake.

    Completion Projection: A "Reality Check" that tells the user, "At your current speed, you will finish on [Date]."

4. Technical Architecture
4.1 Data & Privacy (Local-First)

    Storage: All data is stored via SQLite or Local Storage.

    Privacy: No user account, no email, and no cloud syncing required.

    Offline Functionality: The app must be 100% functional without an internet connection.

4.2 Metadata Structure

The app will reference a local mapping file to provide context for page numbers:
JSON

{
  "page": 45,
  "surah": "Al-Imran",
  "juz": 3,
  "is_prostration_verse": false
}

5. UI/UX Principles

    Low Friction: No more than 2 taps to log progress.

    Night-Vision Friendly: A true OLED dark mode for late-night reading.

    Zero Distractions: No social feeds, no ads, no community "leaderboards." Just the user and their book.

6. Implementation Roadmap
Phase 1: The Engine (MVP)

    [ ] Build the calculation logic.

    [ ] Implement local storage for "Current Page."

    [ ] Basic Dashboard showing "Today's Goal."

Phase 2: The Experience

    [ ] Integrate Surah/Juz mapping.

    [ ] Add "Prayer-based" goal splitting.

    [ ] Implement Dark Mode.

Phase 3: Polish

    [ ] Local notifications (Reminders).

    [ ] Progress visualization (Simple charts).

    [ ] Export data to PDF/CSV.

    Developer Note: Ensure the "Days Remaining" logic accounts for the fact that a "Day" in Ramadan typically ends at Maghrib, not midnight.
