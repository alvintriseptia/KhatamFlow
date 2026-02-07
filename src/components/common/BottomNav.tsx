import React from 'react';
import { useNavigationStore, ViewType } from '@/store/navigationStore';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const { currentView, navigate } = useNavigationStore();

  const navItems: { view: ViewType; icon: string; label: string }[] = [
    { view: 'dashboard', icon: '📊', label: 'Dashboard' },
    { view: 'history', icon: '📜', label: 'History' },
    { view: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.view}
          className={`bottom-nav__item ${
            currentView === item.view ? 'bottom-nav__item--active' : ''
          }`}
          onClick={() => navigate(item.view)}
          aria-label={item.label}
          aria-current={currentView === item.view ? 'page' : undefined}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
