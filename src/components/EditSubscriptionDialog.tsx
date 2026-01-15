import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type SubscriptionCategory = Database["public"]["Enums"]["subscription_category"];

interface EditSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  subscription: Subscription | null;
}

const categories: SubscriptionCategory[] = [
  "Entertainment",
  "Productivity",
  "Health & Fitness",
  "News & Media",
  "Cloud Storage",
  "Music",
  "Gaming",
  "Other",
];

export const EditSubscriptionDialog = ({
  open,
  onOpenChange,
  onSuccess,
  subscription,
}: EditSubscriptionDialogProps) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [category, setCategory] = useState<SubscriptionCategory>("Other");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setCost(subscription.cost.toString());
      setRenewalDate(subscription.renewal_date);
      setCategory(subscription.category);
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription) return;
    
    setIsLoading(true);

    const { error } = await supabase
      .from("subscriptions")
      .update({
        name: name.trim(),
        cost: parseFloat(cost),
        renewal_date: renewalDate,
        category,
      })
      .eq("id", subscription.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error updating subscription",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription updated!",
        description: `${name} has been updated.`,
      });
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-foreground">Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary/50 border-border focus:border-primary h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cost" className="text-foreground">Monthly Cost ($)</Label>
            <Input
              id="edit-cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="9.99"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="bg-secondary/50 border-border focus:border-primary h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-renewalDate" className="text-foreground">Next Renewal Date</Label>
            <Input
              id="edit-renewalDate"
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              required
              className="bg-secondary/50 border-border focus:border-primary h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category" className="text-foreground">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as SubscriptionCategory)}>
              <SelectTrigger className="bg-secondary/50 border-border focus:border-primary h-11 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border-border hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
