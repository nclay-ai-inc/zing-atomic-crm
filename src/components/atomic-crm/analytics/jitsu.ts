import { jitsuAnalytics, type JitsuClient } from "@jitsu/js";

// Jitsu configuration from environment or defaults
const JITSU_HOST = import.meta.env.VITE_JITSU_HOST || "http://localhost:3049";
const JITSU_WRITE_KEY = import.meta.env.VITE_JITSU_WRITE_KEY || "";

let jitsuClient: JitsuClient | null = null;

/**
 * Initialize Jitsu analytics client
 * Only initializes if write key is configured
 */
export function initJitsu(): JitsuClient | null {
  if (!JITSU_WRITE_KEY) {
    console.warn(
      "[Jitsu] No write key configured. Set VITE_JITSU_WRITE_KEY to enable analytics."
    );
    return null;
  }

  if (jitsuClient) {
    return jitsuClient;
  }

  jitsuClient = jitsuAnalytics({
    host: JITSU_HOST,
    writeKey: JITSU_WRITE_KEY,
    debug: import.meta.env.DEV,
  });

  return jitsuClient;
}

/**
 * Get the Jitsu client instance
 */
export function getJitsu(): JitsuClient | null {
  return jitsuClient;
}

/**
 * Track a page view
 */
export function trackPageView(pageName?: string, properties?: Record<string, unknown>) {
  const client = getJitsu();
  if (!client) return;

  client.page({
    name: pageName,
    ...properties,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  const client = getJitsu();
  if (!client) return;

  client.track(eventName, properties);
}

/**
 * Identify a user
 */
export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>
) {
  const client = getJitsu();
  if (!client) return;

  client.identify(userId, traits);
}

/**
 * Set user group (organization)
 */
export function setGroup(
  groupType: string,
  groupId: string,
  traits?: Record<string, unknown>
) {
  const client = getJitsu();
  if (!client) return;

  client.group(groupId, {
    groupType,
    ...traits,
  });
}

/**
 * Reset analytics (on logout)
 */
export function resetAnalytics() {
  const client = getJitsu();
  if (!client) return;

  client.reset();
}

// CRM-specific tracking helpers

/**
 * Track contact created
 */
export function trackContactCreated(contactId: string, properties?: Record<string, unknown>) {
  trackEvent("contact_created", { contactId, ...properties });
}

/**
 * Track contact viewed
 */
export function trackContactViewed(contactId: string) {
  trackEvent("contact_viewed", { contactId });
}

/**
 * Track deal created
 */
export function trackDealCreated(
  dealId: string,
  stage?: string,
  amount?: number
) {
  trackEvent("deal_created", { dealId, stage, amount });
}

/**
 * Track deal stage changed
 */
export function trackDealStageChanged(
  dealId: string,
  fromStage: string,
  toStage: string,
  amount?: number
) {
  trackEvent("deal_stage_changed", { dealId, fromStage, toStage, amount });
}

/**
 * Track deal won
 */
export function trackDealWon(dealId: string, amount?: number) {
  trackEvent("deal_won", { dealId, amount });
}

/**
 * Track deal lost
 */
export function trackDealLost(dealId: string, amount?: number, reason?: string) {
  trackEvent("deal_lost", { dealId, amount, reason });
}

/**
 * Track task created
 */
export function trackTaskCreated(taskId: string, taskType?: string) {
  trackEvent("task_created", { taskId, taskType });
}

/**
 * Track task completed
 */
export function trackTaskCompleted(taskId: string, taskType?: string) {
  trackEvent("task_completed", { taskId, taskType });
}

/**
 * Track company created
 */
export function trackCompanyCreated(companyId: string, sector?: string) {
  trackEvent("company_created", { companyId, sector });
}

/**
 * Track note added
 */
export function trackNoteAdded(
  noteType: "contact" | "deal",
  parentId: string
) {
  trackEvent("note_added", { noteType, parentId });
}

/**
 * Track search performed
 */
export function trackSearch(query: string, resultCount: number) {
  trackEvent("search_performed", { query, resultCount });
}

/**
 * Track CSV import
 */
export function trackCsvImport(recordCount: number, recordType: string) {
  trackEvent("csv_import", { recordCount, recordType });
}

/**
 * Track CSV export
 */
export function trackCsvExport(recordCount: number, recordType: string) {
  trackEvent("csv_export", { recordCount, recordType });
}
