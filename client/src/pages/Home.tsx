import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import {
  Search,
  Pill,
  TrendingDown,
  MapPin,
  Shield,
  Clock,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartSearch = () => {
    if (isAuthenticated) {
      navigate("/search");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Pill className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-black text-foreground">MediFind</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              How It Works
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </div>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())} variant="default" size="sm">
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                How It Works
              </a>
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">{user?.name}</span>
                  <Button onClick={() => navigate("/dashboard")} variant="default" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </>
              ) : (
                <Button onClick={() => (window.location.href = getLoginUrl())} variant="default" size="sm" className="w-full">
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with CTA */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Decorative accent shapes */}
        <div className="accent-shape-circle-pink w-64 h-64 -top-32 -right-32" />
        <div className="accent-shape-blob w-48 h-48 bottom-10 -left-24" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Find Affordable
              <br />
              <span className="text-accent">Medicine Alternatives</span>
            </h1>

            <p className="subtitle text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Discover safe, verified generic alternatives to expensive branded medicines. Compare prices, check pharmacy availability, and save on your healthcare costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={handleStartSearch}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-lg"
              >
                Start Medicine Search
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/upload-prescription")}
                  className="px-8 py-6 text-lg"
                >
                  Upload Prescription
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-6 text-lg"
              >
                Learn How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <span>Regulatory Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                <span>Save Up to 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Real-time Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Powerful Features</h2>
            <p className="subtitle text-lg max-w-2xl mx-auto">
              Everything you need to make informed medication choices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Medicine Search */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                <Search className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-black mb-3">Smart Medicine Search</h3>
              <p className="text-muted-foreground">
                Search by medicine name and get instant analysis of active ingredients, therapeutic category, and dosage forms with regulatory approval status.
              </p>
            </div>

            {/* Feature 2: Generic Alternatives */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                <Pill className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-black mb-3">Generic Alternatives</h3>
              <p className="text-muted-foreground">
                AI-powered discovery of safe, verified generic and lower-cost branded alternatives with active ingredient equivalence verification.
              </p>
            </div>

            {/* Feature 3: Price Comparison */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                <TrendingDown className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-black mb-3">Real-time Price Comparison</h3>
              <p className="text-muted-foreground">
                Compare prices across multiple brands and pharmacies with affordability insights and savings highlights updated in real-time.
              </p>
            </div>

            {/* Feature 4: Pharmacy Locator */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-black mb-3">Nearby Pharmacy Locator</h3>
              <p className="text-muted-foreground">
                Find nearby pharmacies that stock your medicine and alternatives on an interactive map with real-time availability.
              </p>
            </div>

            {/* Feature 5: Prescription Upload */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                <Search className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-black mb-3">Prescription Upload</h3>
              <p className="text-muted-foreground">
                Upload prescription images or PDFs. Our AI automatically extracts medicine names and dosages to trigger instant analysis.
              </p>
            </div>

            {/* Feature 6: Safety Alerts */}
            <div className="bg-background rounded-lg p-8 border border-border hover:border-accent/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-black mb-3">Safety Indicators</h3>
              <p className="text-muted-foreground">
                Clear substitution safety indicators and alerts when significantly cheaper equivalents are available, all verified by regulators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="subtitle text-lg max-w-2xl mx-auto">
              Three simple steps to find affordable medicine alternatives
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex gap-8 mb-12 md:mb-16">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-black text-lg mb-4 flex-shrink-0">
                  1
                </div>
                <div className="hidden md:block w-1 h-24 bg-border mt-4" />
              </div>
              <div className="pb-8 md:pb-12">
                <h3 className="text-2xl font-black mb-3">Search or Upload</h3>
                <p className="text-muted-foreground text-lg">
                  Enter your medicine name or upload a prescription image/PDF. Our AI instantly extracts the medicine details and dosage information.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 mb-12 md:mb-16">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-black text-lg mb-4 flex-shrink-0">
                  2
                </div>
                <div className="hidden md:block w-1 h-24 bg-border mt-4" />
              </div>
              <div className="pb-8 md:pb-12">
                <h3 className="text-2xl font-black mb-3">Get Alternatives & Prices</h3>
                <p className="text-muted-foreground text-lg">
                  Receive a structured analysis with active ingredients, therapeutic category, and a list of verified generic or lower-cost alternatives with real-time price comparisons.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-black text-lg mb-4 flex-shrink-0">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3">Find & Save</h3>
                <p className="text-muted-foreground text-lg">
                  Locate nearby pharmacies that stock your medicine or alternatives on an interactive map. Save your searches and favorite medicines for future reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-accent/5 relative overflow-hidden">
        <div className="accent-shape-blob w-96 h-96 -bottom-48 -right-48 opacity-20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Save on Your Medications?
            </h2>
            <p className="subtitle text-lg mb-8">
              Join thousands of users who are already finding affordable medicine alternatives and saving on healthcare costs.
            </p>
            <Button
              onClick={handleStartSearch}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-lg"
            >
              Start Your First Search
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Pill className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-black">MediFind</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making affordable medicine accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 MediFind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
