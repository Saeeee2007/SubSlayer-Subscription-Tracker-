import { AlertTriangle, Lightbulb, TrendingDown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface SavingsCalculatorProps {
  subscriptions: Subscription[];
}

export const SavingsCalculator = ({ subscriptions }: SavingsCalculatorProps) => {
  // Calculate entertainment spending
  const entertainmentSubs = subscriptions.filter(
    (sub) => sub.category === "Entertainment"
  );
  const entertainmentTotal = entertainmentSubs.reduce(
    (sum, sub) => sum + Number(sub.cost),
    0
  );

  const showWarning = entertainmentTotal > 50;
  const potentialSavings = showWarning
    ? entertainmentSubs.length > 0
      ? Math.min(...entertainmentSubs.map((s) => Number(s.cost)))
      : 0
    : 0;

  // Find the cheapest entertainment subscription to suggest canceling
  const cheapestEntertainment = entertainmentSubs.length > 0
    ? entertainmentSubs.reduce((min, sub) =>
        Number(sub.cost) < Number(min.cost) ? sub : min
      )
    : null;

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center shadow-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Smart Insights
          </h2>
        </div>

        {subscriptions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Add subscriptions to see savings opportunities.
          </p>
        ) : showWarning ? (
          <div className="space-y-4">
            {/* Warning Badge */}
            <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  High Entertainment Spending
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're spending <span className="text-warning font-bold">${entertainmentTotal.toFixed(2)}/mo</span> on
                  Entertainment — more than $50!
                </p>
              </div>
            </div>

            {/* Suggestion */}
            {cheapestEntertainment && (
              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl backdrop-blur-sm">
                <TrendingDown className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Consider canceling {cheapestEntertainment.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save <span className="text-primary font-bold">${Number(cheapestEntertainment.cost).toFixed(2)}/mo</span> (
                    ${(Number(cheapestEntertainment.cost) * 12).toFixed(2)}/yr)
                  </p>
                </div>
              </div>
            )}

            {/* Yearly savings projection */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Potential yearly savings
                </span>
                <span className="text-2xl font-bold text-success">
                  ${(potentialSavings * 12).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <p className="text-base text-foreground font-semibold">
              Your spending looks healthy!
            </p>
            <p className="text-sm text-muted-foreground mt-1.5">
              Entertainment spending is under $50/month.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};