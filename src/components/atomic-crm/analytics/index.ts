// Analytics module - Jitsu CDP integration

// Tracking (sending events to Jitsu)
export { useAnalytics } from "./useAnalytics";
export { AnalyticsProvider } from "./AnalyticsProvider";

// Display (showing analytics data from ClickHouse)
export { AnalyticsPage } from "./AnalyticsPage";
export { AnalyticsChart } from "./AnalyticsChart";
export { EventsChart } from "./EventsChart";
export {
  useClickHouseQuery,
  usePageViewsByDay,
  useEventCounts,
  useUniqueUsersByDay,
  useTotalEvents,
  useTotalUniqueUsers,
  useEventsTableStatus,
} from "./useClickHouse";
export {
  initJitsu,
  getJitsu,
  trackPageView,
  trackEvent,
  identifyUser,
  setGroup,
  resetAnalytics,
  // CRM-specific events
  trackContactCreated,
  trackContactViewed,
  trackDealCreated,
  trackDealStageChanged,
  trackDealWon,
  trackDealLost,
  trackTaskCreated,
  trackTaskCompleted,
  trackCompanyCreated,
  trackNoteAdded,
  trackSearch,
  trackCsvImport,
  trackCsvExport,
} from "./jitsu";
