import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, TrendingDown, Bell, Shield, ArrowRight, Check } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: TrendingDown,
      title: "Track Every Dollar",
      description: "See exactly where your subscription money goes each month",
    },
    {
      icon: Bell,
      title: "Never Miss a Renewal",
      description: "Get notified before charges hit your account",
    },
    {
      icon: Shield,
      title: "Spot Hidden Costs",
      description: "Identify subscriptions you forgot you had",
    },
  ];

  const stats = [
    { value: "$240", label: "Avg saved per year" },
    { value: "12+", label: "Subscriptions tracked" },
    { value: "99%", label: "Customer satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(270 60% 55% / 0.2) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SubSlayer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Join 10,000+ users saving money</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Slay Your</span>
            <br />
            <span className="text-gradient">Subscriptions</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The average person spends $273/month on subscriptions they barely use. 
            SubSlayer helps you track, manage, and eliminate wasteful spending.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-14 text-lg gap-2 glow-effect">
                Start Saving Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-lg border-border hover:bg-secondary">
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-32 max-w-3xl mx-auto text-center glass-card p-12 glow-effect">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to take control of your subscriptions?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who have already saved hundreds of dollars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 gap-2">
                <Check className="w-5 h-5" />
                Create Free Account
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">No credit card required</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 SubSlayer. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;