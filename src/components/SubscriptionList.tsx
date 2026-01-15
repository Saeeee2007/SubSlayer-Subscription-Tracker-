import { Trash2, Pencil, Calendar, CreditCard, Tv, Music, Dumbbell, Newspaper, Cloud, Gamepad2, Briefcase, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEdit: (subscription: Subscription) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Entertainment: Tv,
  Productivity: Briefcase,
  "Health & Fitness": Dumbbell,
  "News & Media": Newspaper,
  "Cloud Storage": Cloud,
  Music: Music,
  Gaming: Gamepad2,
  Other: HelpCircle,
};

const categoryColors: Record<string, string> = {
  Entertainment: "bg-chart-entertainment text-white",
  Productivity: "bg-chart-productivity text-white",
  "Health & Fitness": "bg-chart-health text-white",
  "News & Media": "bg-chart-news text-white",
  "Cloud Storage": "bg-chart-cloud text-white",
  Music: "bg-chart-music text-white",
  Gaming: "bg-chart-gaming text-white",
  Other: "bg-chart-other text-white",
};

export const SubscriptionList = ({
  subscriptions,
  isLoading,
  onDelete,
  onEdit,
}: SubscriptionListProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/50 rounded-xl" />
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
    <div className="glass-card p-6 overflow-hidden">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Your Subscriptions
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">App Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Cost</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium">Next Renewal</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => {
              const IconComponent = categoryIcons[sub.category] || HelpCircle;
              return (
                <TableRow 
                  key={sub.id} 
                  className="border-border hover:bg-secondary/30 transition-colors group"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${categoryColors[sub.category] || "bg-chart-other"} flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-foreground">{sub.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">
                      ${Number(sub.cost).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">/mo</span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 bg-secondary/80 rounded-full text-xs text-foreground">
                      {sub.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-sm">{format(new Date(sub.renewal_date), "MMM d, yyyy")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(sub)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(sub.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
