import { DollarSign, CreditCard, Crown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface StatsCardsProps {
  subscriptions: Subscription[];
}

export const StatsCards = ({ subscriptions }: StatsCardsProps) => {
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + Number(sub.cost), 0);
  const activeCount = subscriptions.length;
  
  const mostExpensive = subscriptions.length > 0
    ? subscriptions.reduce((max, sub) => 
        Number(sub.cost) > Number(max.cost) ? sub : max
      , subscriptions[0])
    : null;

  const stats = [
    {
      icon: DollarSign,
      label: "Total Monthly Cost",
      value: `$${totalMonthly.toFixed(2)}`,
      subtext: `$${(totalMonthly * 12).toFixed(2)}/year`,
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: activeCount.toString(),
      subtext: activeCount === 1 ? "subscription" : "subscriptions",
    },
    {
      icon: Crown,
      label: "Most Expensive",
      value: mostExpensive ? `$${Number(mostExpensive.cost).toFixed(2)}` : "$0.00",
      subtext: mostExpensive ? mostExpensive.name : "No subscriptions",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-6 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
          {stat.subtext && (
            <div className="text-xs text-muted-foreground/70 mt-1">{stat.subtext}</div>
          )}
        </div>
      ))}
    </div>
  );
};
