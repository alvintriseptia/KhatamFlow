import { create } from 'zustand';

export type ViewType = 'dashboard' | 'history' | 'settings';

interface NavigationState {
  currentView: ViewType;
  navigate: (view: ViewType) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentView: 'dashboard',
  navigate: (view: ViewType) => set({ currentView: view }),
}));
