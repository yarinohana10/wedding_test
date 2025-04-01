
import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  data: Array<{ timestamp: number; price: number }>;
  color: string;
  height?: number;
  showAxis?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

const PriceChart = ({
  data,
  color,
  height = 100,
  showAxis = false,
  showTooltip = false,
  animated = true,
  className,
}: PriceChartProps) => {
  const trend = useMemo(() => {
    if (data.length < 2) return "neutral";
    return data[data.length - 1].price >= data[0].price ? "up" : "down";
  }, [data]);

  const chartColor = useMemo(() => {
    if (color) return color;
    return trend === "up" ? "#02c076" : "#f6465d";
  }, [color, trend]);

  const tooltipFormatter = (value: number) => {
    return [`$${value.toFixed(2)}`, "Price"];
  };

  const dateFormatter = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {showAxis && (
            <>
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 10 }}
                tickFormatter={dateFormatter}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={30}
                tickFormatter={(tick) => `$${tick}`}
              />
            </>
          )}
          {showTooltip && (
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={dateFormatter}
              contentStyle={{
                backgroundColor: "#1e2026",
                borderColor: "#383a42",
                borderRadius: "6px",
              }}
            />
          )}
          <defs>
            <linearGradient id={`gradient-${chartColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            fill={`url(#gradient-${chartColor.replace('#', '')})`}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={animated}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
