import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface SpendingChartProps {
  subscriptions: Subscription[];
}

const COLORS: Record<string, string> = {
  Entertainment: "#e64980",
  Productivity: "#00d9ff",
  "Health & Fitness": "#10b981",
  "News & Media": "#f59e0b",
  "Cloud Storage": "#8b5cf6",
  Music: "#c084fc",
  Gaming: "#0ea5e9",
  Other: "#6b7280",
};

export const SpendingChart = ({ subscriptions }: SpendingChartProps) => {
  const categoryData = subscriptions.reduce((acc, sub) => {
    const existing = acc.find((item) => item.name === sub.category);
    if (existing) {
      existing.value += Number(sub.cost);
    } else {
      acc.push({
        name: sub.category,
        value: Number(sub.cost),
        color: COLORS[sub.category] || COLORS.Other,
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  if (subscriptions.length === 0) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Spending by Category
        </h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Add subscriptions to see breakdown
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {payload[0].name}
          </p>
          <p className="text-sm text-primary">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Spending by Category
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-4 space-y-2">
        {categoryData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-foreground font-medium">
              ${item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};