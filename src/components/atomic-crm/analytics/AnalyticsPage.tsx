import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";
import { useGetIdentity } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AnalyticsChart } from "./AnalyticsChart";
import { EventsChart } from "./EventsChart";
import {
  useEventsTableStatus,
  usePageViewsByDay,
  useTotalEvents,
  useTotalUniqueUsers,
  useEventCounts,
} from "./useClickHouse";

export const AnalyticsPage = () => {
  // Get organization_id for multi-tenant data filtering
  const { data: identity } = useGetIdentity();
  const organizationId = identity?.organization_id;

  const { data: tableStatus, isPending: isCheckingTable } = useEventsTableStatus();
  const { data: pageViews, isPending: isLoadingPageViews } = usePageViewsByDay(30, organizationId);
  const { data: totalEvents, isPending: isLoadingTotal } = useTotalEvents(30, organizationId);
  const { data: totalUsers, isPending: isLoadingUsers } = useTotalUniqueUsers(30, organizationId);
  const { data: eventCounts, isPending: isLoadingEvents } = useEventCounts(30, organizationId);

  const hasEventsTable = tableStatus?.data?.[0]?.count > 0;
  const isPending = isCheckingTable || isLoadingPageViews || isLoadingTotal || isLoadingUsers || isLoadingEvents;

  if (isPending) {
    return <AnalyticsSkeleton />;
  }

  if (!hasEventsTable) {
    return <AnalyticsEmpty />;
  }

  const totalEventCount = totalEvents?.data?.[0]?.count ?? 0;
  const totalUserCount = totalUsers?.data?.[0]?.count ?? 0;
  const pageViewData = pageViews?.data ?? [];
  const eventCountData = eventCounts?.data ?? [];

  if (totalEventCount === 0) {
    return <AnalyticsEmpty />;
  }

  return (
    <div className="space-y-6 mt-1">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
        <h1 className="text-2xl font-semibold text-muted-foreground">Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={totalEventCount.toLocaleString()}
          icon={<Activity className="h-5 w-5" />}
          description="Last 30 days"
        />
        <StatCard
          title="Unique Users"
          value={totalUserCount.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          description="Last 30 days"
        />
        <StatCard
          title="Page Views"
          value={pageViewData.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Last 30 days"
        />
        <StatCard
          title="Avg Events/Day"
          value={Math.round(totalEventCount / 30).toLocaleString()}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Last 30 days"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-muted-foreground">
                Page Views Over Time
              </h2>
            </div>
            <div className="h-[300px]">
              <AnalyticsChart data={pageViewData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-muted-foreground">
                Top Events
              </h2>
            </div>
            <div className="h-[300px]">
              <EventsChart data={eventCountData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsSkeleton = () => (
  <div className="space-y-6 mt-1">
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const AnalyticsEmpty = () => (
  <div className="space-y-6 mt-1">
    <div className="flex items-center gap-3">
      <BarChart3 className="h-8 w-8 text-muted-foreground" />
      <h1 className="text-2xl font-semibold text-muted-foreground">Analytics</h1>
    </div>

    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            No Analytics Data Yet
          </h2>
          <p className="text-muted-foreground max-w-md">
            Analytics data will appear here once events start being tracked.
            Events are synced to the analytics database every 60 minutes.
          </p>
          <p className="text-sm text-muted-foreground/70 mt-4">
            Make sure Jitsu is configured and the CRM is being used.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

AnalyticsPage.path = "/analytics";
