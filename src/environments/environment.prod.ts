export const environment = {
  production: true,
  apiUrl: 'https://api.your-production-domain.com/api', // Replace with actual production backend URL
  useProxy: false, // In production, make direct requests to backend (no proxy)
  
  // Feature flags
  enableAnalytics: true,
  enableErrorTracking: true,
  enablePerformanceMonitoring: true,
  
  // Cache settings
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minutes
  
  // Session settings
  sessionTimeout: 1800000, // 30 minutes
  refreshBeforeExpiry: 300000, // 5 minutes before expiry
  
  // API settings
  apiTimeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // UI settings
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Security
  enableCSRF: true,
  strictMode: true,
};
