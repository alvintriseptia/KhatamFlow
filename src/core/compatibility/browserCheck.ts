/**
 * Browser Compatibility Checker
 * Detects browser features and provides compatibility information
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export interface CompatibilityCheck {
  isCompatible: boolean;
  features: {
    indexedDB: boolean;
    serviceWorker: boolean;
    notifications: boolean;
    localStorage: boolean;
    pwa: boolean;
  };
  warnings: string[];
  browser: BrowserInfo;
}

/**
 * Detect browser information
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  let name = 'Unknown';
  let version = 'Unknown';

  // Detect browser
  if (ua.indexOf('Firefox') > -1) {
    name = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.indexOf('Edg') > -1) {
    name = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.indexOf('Chrome') > -1) {
    name = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.indexOf('Safari') > -1) {
    name = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }

  return { name, version, isMobile, isIOS, isAndroid };
}

/**
 * Check if IndexedDB is available
 */
export function hasIndexedDB(): boolean {
  try {
    return 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Check if Service Worker is available
 */
export function hasServiceWorker(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Check if Notifications are available
 */
export function hasNotifications(): boolean {
  return 'Notification' in window;
}

/**
 * Check if localStorage is available
 */
export function hasLocalStorage(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if PWA features are available
 */
export function hasPWASupport(): boolean {
  return hasServiceWorker() && 'BeforeInstallPromptEvent' in window;
}

/**
 * Perform full compatibility check
 */
export function checkCompatibility(): CompatibilityCheck {
  const browser = detectBrowser();
  const warnings: string[] = [];

  const features = {
    indexedDB: hasIndexedDB(),
    serviceWorker: hasServiceWorker(),
    notifications: hasNotifications(),
    localStorage: hasLocalStorage(),
    pwa: hasPWASupport(),
  };

  // Check for critical features
  if (!features.indexedDB && !features.localStorage) {
    warnings.push('No storage available. App may not function correctly.');
  }

  // iOS-specific warnings
  if (browser.isIOS) {
    if (!features.notifications) {
      warnings.push(
        'Notifications are not available in Safari on iOS. Add the app to your home screen for notification support.'
      );
    }
  }

  // Private browsing detection
  if (!features.indexedDB && features.localStorage) {
    warnings.push(
      'You may be in private browsing mode. Some features may be limited.'
    );
  }

  // Service worker warning
  if (!features.serviceWorker) {
    warnings.push('Service Worker not supported. Offline mode unavailable.');
  }

  const isCompatible =
    (features.indexedDB || features.localStorage) &&
    features.serviceWorker;

  return {
    isCompatible,
    features,
    warnings,
    browser,
  };
}

/**
 * Log compatibility information to console
 */
export function logCompatibilityInfo(): void {
  const check = checkCompatibility();

  console.group('🔍 KhatamFlow Browser Compatibility Check');
  console.log('Browser:', `${check.browser.name} ${check.browser.version}`);
  console.log('Platform:', check.browser.isMobile ? 'Mobile' : 'Desktop');
  if (check.browser.isIOS) console.log('iOS Device detected');
  if (check.browser.isAndroid) console.log('Android Device detected');
  console.log('\nFeatures:');
  console.table(check.features);

  if (check.warnings.length > 0) {
    console.warn('\n⚠️ Warnings:');
    check.warnings.forEach((warning) => console.warn(`- ${warning}`));
  }

  console.log(
    '\nCompatibility:',
    check.isCompatible ? '✅ Compatible' : '❌ Incompatible'
  );
  console.groupEnd();
}

/**
 * Get user-friendly browser name for display
 */
export function getBrowserDisplayName(): string {
  const browser = detectBrowser();
  return `${browser.name} ${browser.version}`;
}
