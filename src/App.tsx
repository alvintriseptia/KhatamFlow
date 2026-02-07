import { useEffect } from 'react';
import { useProgressStore } from './store/progressStore';
import { useSettingsStore } from './store/settingsStore';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import './assets/styles/themes.css';
import './assets/styles/global.css';

function App() {
  const { goal, isInitialized, isLoading, initializeFromStorage } = useProgressStore();
  const { loadSettings } = useSettingsStore();

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

  // Show main dashboard
  return <Dashboard />;
}

export default App;
