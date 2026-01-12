import { ResponsiveBar } from "@nivo/bar";
import { memo, useMemo } from "react";

import type { EventCount } from "./useClickHouse";

interface EventsChartProps {
  data: EventCount[];
}

export const EventsChart = memo(({ data }: EventsChartProps) => {
  const chartData = useMemo(() => {
    // Take top 10 events and format names
    return data.slice(0, 10).map((item) => ({
      event: formatEventName(item.event),
      count: item.count,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No events tracked yet
      </div>
    );
  }

  return (
    <ResponsiveBar
      data={chartData}
      keys={["count"]}
      indexBy="event"
      layout="horizontal"
      margin={{ top: 20, right: 20, bottom: 30, left: 120 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#00D4FF"]}
      enableGridX={true}
      enableGridY={false}
      enableLabel={true}
      labelSkipWidth={12}
      labelTextColor="#0F0F23"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: 5,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
      }}
      tooltip={({ value, indexValue }) => (
        <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded shadow text-sm">
          <strong>{indexValue}:</strong> {value.toLocaleString()} events
        </div>
      )}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: "var(--color-muted-foreground)",
            },
          },
        },
        grid: {
          line: {
            stroke: "var(--color-border)",
          },
        },
      }}
    />
  );
});

EventsChart.displayName = "EventsChart";

/**
 * Format event name for display
 * e.g., "contact_created" -> "Contact Created"
 */
function formatEventName(event: string): string {
  if (!event) return "Unknown";
  return event
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
