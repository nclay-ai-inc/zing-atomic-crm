import { useQuery } from "@tanstack/react-query";

// ClickHouse configuration from environment
const CLICKHOUSE_HOST = import.meta.env.VITE_CLICKHOUSE_HOST || "http://localhost:8123";
const CLICKHOUSE_USER = import.meta.env.VITE_CLICKHOUSE_USER || "default";
const CLICKHOUSE_PASSWORD = import.meta.env.VITE_CLICKHOUSE_PASSWORD || "clickhouse-pass";

interface ClickHouseQueryResult<T> {
  meta: Array<{ name: string; type: string }>;
  data: T[];
  rows: number;
  rows_before_limit_at_least: number;
  statistics: {
    elapsed: number;
    rows_read: number;
    bytes_read: number;
  };
}

/**
 * Execute a query against ClickHouse
 */
async function queryClickHouse<T>(sql: string): Promise<ClickHouseQueryResult<T>> {
  const url = new URL(CLICKHOUSE_HOST);
  url.searchParams.set("user", CLICKHOUSE_USER);
  url.searchParams.set("password", CLICKHOUSE_PASSWORD);

  const response = await fetch(url.toString(), {
    method: "POST",
    body: `${sql} FORMAT JSON`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ClickHouse query failed: ${error}`);
  }

  return response.json();
}

/**
 * Sanitize organization ID for safe SQL usage
 * Prevents SQL injection by ensuring the value is a valid identifier
 */
function sanitizeOrgId(orgId: string | number | undefined): string | null {
  if (orgId === undefined || orgId === null || orgId === "") {
    return null;
  }
  // Convert to string and remove any non-alphanumeric characters except hyphens
  const sanitized = String(orgId).replace(/[^a-zA-Z0-9-]/g, "");
  return sanitized || null;
}

/**
 * Build organization filter clause for ClickHouse queries
 * Uses groupId column which is set by Jitsu's setGroup() call
 */
function buildOrgFilter(orgId: string | number | undefined): string {
  const sanitized = sanitizeOrgId(orgId);
  if (!sanitized) {
    return "";
  }
  // Jitsu stores group data in groupId column
  return `AND groupId = '${sanitized}'`;
}

/**
 * Hook to query ClickHouse with React Query
 */
export function useClickHouseQuery<T>(
  queryKey: string[],
  sql: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: ["clickhouse", ...queryKey],
    queryFn: () => queryClickHouse<T>(sql),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    retry: 1,
  });
}

// Event types from Jitsu
export interface JitsuEvent {
  timestamp: string;
  event: string;
  type: string;
  userId?: string;
  anonymousId?: string;
  properties?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface PageViewEvent {
  timestamp: string;
  path: string;
  userId?: string;
  anonymousId?: string;
}

export interface EventCount {
  event: string;
  count: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

/**
 * Hook to get page view counts by day
 * @param days - Number of days to look back (default 30)
 * @param organizationId - Organization ID for multi-tenant filtering
 */
export function usePageViewsByDay(days: number = 30, organizationId?: string | number) {
  const orgFilter = buildOrgFilter(organizationId);
  const sql = `
    SELECT
      toDate(timestamp) as date,
      count() as count
    FROM events
    WHERE type = 'page'
      AND timestamp >= now() - INTERVAL ${days} DAY
      ${orgFilter}
    GROUP BY date
    ORDER BY date ASC
  `;

  return useClickHouseQuery<DailyCount>(
    ["page-views-by-day", String(days), String(organizationId || "all")],
    sql,
    { enabled: !!organizationId }
  );
}

/**
 * Hook to get event counts by type
 * @param days - Number of days to look back (default 30)
 * @param organizationId - Organization ID for multi-tenant filtering
 */
export function useEventCounts(days: number = 30, organizationId?: string | number) {
  const orgFilter = buildOrgFilter(organizationId);
  const sql = `
    SELECT
      event,
      count() as count
    FROM events
    WHERE timestamp >= now() - INTERVAL ${days} DAY
      AND event IS NOT NULL
      ${orgFilter}
    GROUP BY event
    ORDER BY count DESC
    LIMIT 20
  `;

  return useClickHouseQuery<EventCount>(
    ["event-counts", String(days), String(organizationId || "all")],
    sql,
    { enabled: !!organizationId }
  );
}

/**
 * Hook to get unique user counts by day
 * @param days - Number of days to look back (default 30)
 * @param organizationId - Organization ID for multi-tenant filtering
 */
export function useUniqueUsersByDay(days: number = 30, organizationId?: string | number) {
  const orgFilter = buildOrgFilter(organizationId);
  const sql = `
    SELECT
      toDate(timestamp) as date,
      uniqExact(coalesce(userId, anonymousId)) as count
    FROM events
    WHERE timestamp >= now() - INTERVAL ${days} DAY
      ${orgFilter}
    GROUP BY date
    ORDER BY date ASC
  `;

  return useClickHouseQuery<DailyCount>(
    ["unique-users-by-day", String(days), String(organizationId || "all")],
    sql,
    { enabled: !!organizationId }
  );
}

/**
 * Hook to get total event count
 * @param days - Number of days to look back (default 30)
 * @param organizationId - Organization ID for multi-tenant filtering
 */
export function useTotalEvents(days: number = 30, organizationId?: string | number) {
  const orgFilter = buildOrgFilter(organizationId);
  const sql = `
    SELECT count() as count FROM events
    WHERE timestamp >= now() - INTERVAL ${days} DAY
      ${orgFilter}
  `;

  return useClickHouseQuery<{ count: number }>(
    ["total-events", String(days), String(organizationId || "all")],
    sql,
    { enabled: !!organizationId }
  );
}

/**
 * Hook to get total unique users
 * @param days - Number of days to look back (default 30)
 * @param organizationId - Organization ID for multi-tenant filtering
 */
export function useTotalUniqueUsers(days: number = 30, organizationId?: string | number) {
  const orgFilter = buildOrgFilter(organizationId);
  const sql = `
    SELECT uniqExact(coalesce(userId, anonymousId)) as count FROM events
    WHERE timestamp >= now() - INTERVAL ${days} DAY
      ${orgFilter}
  `;

  return useClickHouseQuery<{ count: number }>(
    ["total-unique-users", String(days), String(organizationId || "all")],
    sql,
    { enabled: !!organizationId }
  );
}

/**
 * Check if events table exists and has data
 * Note: This checks system tables, not user data, so no org filter needed
 */
export function useEventsTableStatus() {
  const sql = `
    SELECT count() as count FROM system.tables
    WHERE database = 'default' AND name = 'events'
  `;

  return useClickHouseQuery<{ count: number }>(
    ["events-table-exists"],
    sql
  );
}
