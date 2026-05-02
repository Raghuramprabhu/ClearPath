const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Wrapper for fetch with credentials and error handling.
 * All API calls go through this to ensure consistent auth and error behavior.
 */
const apiCall = async (endpoint, options = {}) => {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth
export const authApi = {
  getMe: () => apiCall('/api/auth/me'),
  loginWithGoogle: (credential) => apiCall('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  }),
  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
};

// Meetings
export const meetingsApi = {
  postIntelligence: (notes, spreadsheetId) => apiCall('/api/meetings/post-intelligence', {
    method: 'POST',
    body: JSON.stringify({ notes, spreadsheetId }),
  }),
  preBriefManual: (documentId, attendeeTasks) => apiCall('/api/meetings/pre-brief-manual', {
    method: 'POST',
    body: JSON.stringify({ documentId, attendeeTasks }),
  }),
};

// Scheduler
export const schedulerApi = {
  smartHelp: (requestText) => apiCall('/api/scheduler/smart-help', {
    method: 'POST',
    body: JSON.stringify({ requestText }),
  }),
  dailyOffload: (tasks, calendarBlocks) => apiCall('/api/scheduler/daily-offload', {
    method: 'POST',
    body: JSON.stringify({ tasks, calendarBlocks }),
  }),
};

// Gentle Nudge
export const nudgeApi = {
  check: (taskName, assigneeName, daysSinceUpdate, deadline) => apiCall('/api/nudge/check', {
    method: 'POST',
    body: JSON.stringify({ taskName, assigneeName, daysSinceUpdate, deadline }),
  }),
  respond: (taskId, responseOption, taskName) => apiCall('/api/nudge/respond', {
    method: 'POST',
    body: JSON.stringify({ taskId, responseOption, taskName }),
  }),
  monitor: (tasks) => apiCall('/api/nudge/monitor', {
    method: 'POST',
    body: JSON.stringify({ tasks }),
  }),
};

// Ippo Task Intelligence
export const ippoApi = {
  breakdown: (taskDescription, neurodivergentMode) => apiCall('/api/ippo/breakdown', {
    method: 'POST',
    body: JSON.stringify({ taskDescription, neurodivergentMode }),
  }),
  recovery: (taskDescription) => apiCall('/api/ippo/recovery', {
    method: 'POST',
    body: JSON.stringify({ taskDescription }),
  }),
  complete: (taskTitle, stepNumber, totalSteps, isFullComplete) => apiCall('/api/ippo/complete', {
    method: 'POST',
    body: JSON.stringify({ taskTitle, stepNumber, totalSteps, isFullComplete }),
  }),
};
