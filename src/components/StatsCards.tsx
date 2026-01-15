import { DollarSign, Calendar, TrendingUp, CreditCard } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface StatsCardsProps {
  subscriptions: Subscription[];
}

export const StatsCards = ({ subscriptions }: StatsCardsProps) => {
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + Number(sub.cost), 0);
  const totalYearly = totalMonthly * 12;
  const activeCount = subscriptions.length;
  
  const upcomingRenewals = subscriptions.filter((sub) => {
    const renewalDate = new Date(sub.renewal_date);
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return renewalDate >= today && renewalDate <= sevenDaysFromNow;
  }).length;

  const stats = [
    {
      icon: DollarSign,
      label: "Monthly Spend",
      value: `$${totalMonthly.toFixed(2)}`,
      change: null,
    },
    {
      icon: TrendingUp,
      label: "Yearly Projection",
      value: `$${totalYearly.toFixed(2)}`,
      change: null,
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: activeCount.toString(),
      change: null,
    },
    {
      icon: Calendar,
      label: "Upcoming Renewals",
      value: upcomingRenewals.toString(),
      subtext: "Next 7 days",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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