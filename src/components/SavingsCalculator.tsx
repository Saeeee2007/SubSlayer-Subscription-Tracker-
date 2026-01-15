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
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold text-foreground">
          Savings Calculator
        </h2>
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Add subscriptions to see savings opportunities.
        </p>
      ) : showWarning ? (
        <div className="space-y-4">
          {/* Warning Badge */}
          <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                High Entertainment Spending
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You're spending <span className="text-warning font-semibold">${entertainmentTotal.toFixed(2)}/month</span> on
                Entertainment — more than $50!
              </p>
            </div>
          </div>

          {/* Suggestion */}
          {cheapestEntertainment && (
            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <TrendingDown className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Consider canceling {cheapestEntertainment.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Save <span className="text-primary font-semibold">${Number(cheapestEntertainment.cost).toFixed(2)}/month</span> (
                  ${(Number(cheapestEntertainment.cost) * 12).toFixed(2)}/year)
                </p>
              </div>
            </div>
          )}

          {/* Yearly savings projection */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Potential yearly savings
              </span>
              <span className="text-lg font-bold text-success">
                ${(potentialSavings * 12).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <TrendingDown className="w-6 h-6 text-success" />
          </div>
          <p className="text-sm text-foreground font-medium">
            Your spending looks healthy!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Entertainment spending is under $50/month.
          </p>
        </div>
      )}
    </div>
  );
};