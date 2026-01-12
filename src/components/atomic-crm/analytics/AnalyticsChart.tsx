import { ResponsiveBar } from "@nivo/bar";
import { format } from "date-fns";
import { memo, useMemo } from "react";

import type { DailyCount } from "./useClickHouse";

interface AnalyticsChartProps {
  data: DailyCount[];
}

export const AnalyticsChart = memo(({ data }: AnalyticsChartProps) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: format(new Date(item.date), "MMM d"),
      count: item.count,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveBar
      data={chartData}
      keys={["count"]}
      indexBy="date"
      margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#6366F1"]}
      enableGridX={false}
      enableGridY={true}
      enableLabel={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: -45,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: 5,
      }}
      tooltip={({ value, indexValue }) => (
        <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded shadow text-sm">
          <strong>{indexValue}:</strong> {value.toLocaleString()} views
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

AnalyticsChart.displayName = "AnalyticsChart";
