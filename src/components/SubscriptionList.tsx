import { Trash2, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Entertainment: "bg-chart-entertainment",
  Productivity: "bg-chart-productivity",
  "Health & Fitness": "bg-chart-health",
  "News & Media": "bg-chart-news",
  "Cloud Storage": "bg-chart-cloud",
  Music: "bg-chart-music",
  Gaming: "bg-chart-gaming",
  Other: "bg-chart-other",
};

export const SubscriptionList = ({
  subscriptions,
  isLoading,
  onDelete,
}: SubscriptionListProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No subscriptions yet
        </h3>
        <p className="text-muted-foreground">
          Add your first subscription to start tracking your spending.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Your Subscriptions
      </h2>
      <div className="space-y-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-3 h-3 rounded-full ${categoryColors[sub.category] || "bg-chart-other"}`}
              />
              <div>
                <div className="font-medium text-foreground">{sub.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-secondary rounded-md text-xs">
                    {sub.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(sub.renewal_date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  ${Number(sub.cost).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">/month</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(sub.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};