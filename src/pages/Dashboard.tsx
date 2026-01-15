import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Zap, Plus, LogOut, Loader2 } from "lucide-react";
import { SubscriptionList } from "@/components/SubscriptionList";
import { AddSubscriptionDialog } from "@/components/AddSubscriptionDialog";
import { EditSubscriptionDialog } from "@/components/EditSubscriptionDialog";
import { SpendingChart } from "@/components/SpendingChart";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { StatsCards } from "@/components/StatsCards";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/login");
        } else {
          setUser(session.user);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        fetchSubscriptions();
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [navigate]);

  const seedSampleData = async (userId: string) => {
    const today = new Date();
    const sampleSubscriptions = [
      { name: "Netflix", cost: 15.99, renewal_date: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0], category: "Entertainment" as const },
      { name: "Spotify", cost: 9.99, renewal_date: new Date(today.getFullYear(), today.getMonth(), 22).toISOString().split('T')[0], category: "Music" as const },
      { name: "Planet Fitness", cost: 24.99, renewal_date: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0], category: "Health & Fitness" as const },
      { name: "Disney+", cost: 13.99, renewal_date: new Date(today.getFullYear(), today.getMonth(), 8).toISOString().split('T')[0], category: "Entertainment" as const },
      { name: "iCloud Storage", cost: 2.99, renewal_date: new Date(today.getFullYear(), today.getMonth(), 28).toISOString().split('T')[0], category: "Cloud Storage" as const },
      { name: "Xbox Game Pass", cost: 16.99, renewal_date: new Date(today.getFullYear(), today.getMonth() + 1, 5).toISOString().split('T')[0], category: "Gaming" as const },
    ];

    const { error } = await supabase.from("subscriptions").insert(
      sampleSubscriptions.map(sub => ({ ...sub, user_id: userId }))
    );

    if (error) {
      console.error("Error seeding sample data:", error);
    }
  };

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("renewal_date", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching subscriptions",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // If no subscriptions exist, seed sample data
      if (data && data.length === 0) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await seedSampleData(currentUser.id);
          // Fetch again after seeding
          const { data: seededData } = await supabase
            .from("subscriptions")
            .select("*")
            .order("renewal_date", { ascending: true });
          setSubscriptions(seededData || []);
        }
      } else {
        setSubscriptions(data || []);
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSubscriptionAdded = () => {
    fetchSubscriptions();
    setIsDialogOpen(false);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const handleSubscriptionUpdated = () => {
    fetchSubscriptions();
    setIsEditDialogOpen(false);
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = async (id: string) => {
    const { error } = await supabase.from("subscriptions").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting subscription",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed.",
      });
      fetchSubscriptions();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-0 right-0 w-[600px] h-[400px] opacity-15 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
      <div className="fixed bottom-0 left-0 w-[500px] h-[300px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(270 60% 55% / 0.3) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SubSlayer</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.email}
              </span>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your subscriptions</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Subscription
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards subscriptions={subscriptions} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Subscriptions List */}
          <div className="lg:col-span-2">
            <SubscriptionList
              subscriptions={subscriptions}
              isLoading={isLoading}
              onDelete={handleDeleteSubscription}
              onEdit={handleEditSubscription}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <SpendingChart subscriptions={subscriptions} />
            <SavingsCalculator subscriptions={subscriptions} />
          </div>
        </div>
      </main>

      {/* Add Subscription Dialog */}
      <AddSubscriptionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSubscriptionAdded}
      />

      {/* Edit Subscription Dialog */}
      <EditSubscriptionDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleSubscriptionUpdated}
        subscription={editingSubscription}
      />
    </div>
  );
};

export default Dashboard;