import { useEffect, lazy, Suspense } from 'react';
import { useProgressStore } from './store/progressStore';
import { useSettingsStore } from './store/settingsStore';
import { useNavigationStore } from './store/navigationStore';
import { Onboarding } from './views/Onboarding';
import BottomNav from './components/common/BottomNav';
import './assets/styles/themes.css';
import './assets/styles/global.css';

// Lazy load views for code splitting
const Dashboard = lazy(() => import('./views/Dashboard').then(m => ({ default: m.Dashboard })));
const History = lazy(() => import('./views/History').then(m => ({ default: m.History })));
const Settings = lazy(() => import('./views/Settings').then(m => ({ default: m.Settings })));

function App() {
  const { goal, isInitialized, isLoading, initializeFromStorage } = useProgressStore();
  const { loadSettings } = useSettingsStore();
  const { currentView } = useNavigationStore();

  useEffect(() => {
    // Initialize app data
    const init = async () => {
      await Promise.all([
        initializeFromStorage(),
        loadSettings()
      ]);
    };

    init();
  }, [initializeFromStorage, loadSettings]);

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="loading">
        <div>Loading KhatamFlow...</div>
      </div>
    );
  }

  // Show onboarding if no goal is set
  if (!goal) {
    return <Onboarding />;
  }

  // Render current view based on navigation
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-content">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        {renderView()}
      </Suspense>
      <BottomNav />
    </div>
  );
}

export default App;
