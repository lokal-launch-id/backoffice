// Environment Configuration
export const ENV = {
  // Environment
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'LokaLaunch Backoffice',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',

  // External Services
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,

  // Development Settings
  DEV_MOCK_API: import.meta.env.VITE_DEV_MOCK_API === 'true',
  DEV_API_DELAY: parseInt(import.meta.env.VITE_DEV_API_DELAY || '0'),
} as const

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    apiBaseUrl: 'http://localhost:8080',
    enableMockApi: false,
    enableDebug: true,
    apiDelay: 0, // Simulate network delay in ms
  },
  production: {
    apiBaseUrl: ENV.API_BASE_URL,
    enableMockApi: false,
    enableDebug: false,
    apiDelay: 0,
  },
} as const

// Get current environment config
export const getCurrentEnvConfig = () => {
  return ENV.IS_DEV ? ENV_CONFIG.development : ENV_CONFIG.production
}

// Helper to check if we should use mock data
export const shouldUseMockApi = () => {
  return (
    ENV.IS_DEV && (ENV.DEV_MOCK_API || ENV_CONFIG.development.enableMockApi)
  )
}

// Helper to get API base URL
export const getApiBaseUrl = () => {
  return getCurrentEnvConfig().apiBaseUrl
}

// Debug logging
if (ENV.IS_DEV && ENV.ENABLE_DEBUG) {
  console.log('🔧 Environment Configuration:', {
    mode: ENV.NODE_ENV,
    apiBaseUrl: getApiBaseUrl(),
    useMockApi: shouldUseMockApi(),
    config: getCurrentEnvConfig(),
  })
}
