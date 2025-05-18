// Feature flags configuration
type FeatureFlag = {
  name: string;
  description: string;
  enabled: boolean;
  enabledForUsers?: string[]; // User IDs or emails
  enabledForPercentage?: number; // 0-100
};

// Define your feature flags here
const featureFlags: Record<string, FeatureFlag> = {
  commandPalette: {
    name: 'Command Palette',
    description: 'Enable the command palette (Ctrl+K or Cmd+K)',
    enabled: true,
  },
  offlineMode: {
    name: 'Offline Mode',
    description: 'Enable offline-first functionality',
    enabled: true,
  },
  performanceMetrics: {
    name: 'Performance Metrics',
    description: 'Enable performance monitoring and metrics',
    enabled: process.env.NODE_ENV === 'development',
  },
  // Add more feature flags as needed
};

/**
 * Check if a feature is enabled for the current user
 * @param featureName Name of the feature flag
 * @param userId Optional user ID or email to check feature access
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(
  featureName: string,
  userId?: string
): boolean {
  const feature = featureFlags[featureName];
  
  if (!feature) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Feature flag "${featureName}" not found`);
    }
    return false;
  }

  // Check if feature is globally disabled
  if (!feature.enabled) {
    return false;
  }

  // Check if user is in the enabled users list
  if (userId && feature.enabledForUsers?.includes(userId)) {
    return true;
  }

  // Check if user is in the enabled percentage
  if (feature.enabledForPercentage !== undefined) {
    const hash = userId 
      ? Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100
      : Math.floor(Math.random() * 100);
    
    return hash < feature.enabledForPercentage;
  }

  return true;
}

/**
 * Get all feature flags (for admin UI)
 */
export function getAllFeatures(): FeatureFlag[] {
  return Object.values(featureFlags);
}

/**
 * Enable or disable a feature flag at runtime
 * Note: This only affects the current session
 */
export function setFeatureEnabled(featureName: string, enabled: boolean): void {
  if (featureFlags[featureName]) {
    featureFlags[featureName].enabled = enabled;
  } else if (process.env.NODE_ENV === 'development') {
    console.warn(`Cannot set feature flag "${featureName}": not found`);
  }
}

// Example usage:
// if (isFeatureEnabled('commandPalette')) {
//   // Enable command palette
// }
