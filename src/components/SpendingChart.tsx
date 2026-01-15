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

  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Spending by Category
        </h2>
        <div className="h-52 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="drop-shadow-lg"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">${total.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">total</div>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-6 space-y-2.5">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm group">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
              </div>
              <span className="text-foreground font-semibold tabular-nums">
                ${item.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};