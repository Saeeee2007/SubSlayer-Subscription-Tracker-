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
      highlight: true,
      gradient: "from-primary to-blue-500",
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: activeCount.toString(),
      subtext: activeCount === 1 ? "subscription" : "subscriptions",
      highlight: false,
      gradient: "from-accent to-pink-500",
    },
    {
      icon: Crown,
      label: "Most Expensive",
      value: mostExpensive ? `$${Number(mostExpensive.cost).toFixed(2)}` : "$0.00",
      subtext: mostExpensive ? mostExpensive.name : "No subscriptions",
      highlight: false,
      gradient: "from-warning to-orange-500",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`glass-card p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300 ${
            stat.highlight ? "ring-1 ring-primary/20" : ""
          }`}
        >
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.highlight && (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                  Monthly
                </span>
              )}
            </div>
            <div className={`font-bold text-foreground mb-1 ${stat.highlight ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            {stat.subtext && (
              <div className="text-xs text-muted-foreground/60 mt-1.5">{stat.subtext}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
