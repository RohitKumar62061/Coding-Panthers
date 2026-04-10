import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Clock,
  Heart,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("history");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your dashboard.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              ← Back Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Search History
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Saved Medicines
            </TabsTrigger>
          </TabsList>

          {/* Search History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-black mb-2">Recent Searches</h2>
              <p className="text-sm text-muted-foreground">
                View all your recent medicine searches and analysis
              </p>
            </div>

            <SearchHistoryContent />
          </TabsContent>

          {/* Saved Medicines Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-black mb-2">Saved Medicines</h2>
              <p className="text-sm text-muted-foreground">
                Your collection of medicines you want to track
              </p>
            </div>

            <SavedMedicinesContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SearchHistoryContent() {
  const [, navigate] = useLocation();

  // Mock search history data
  const searchHistory = [
    {
      id: 1,
      query: "Aspirin",
      medicineId: 1,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      query: "Metformin",
      medicineId: 2,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      query: "Lisinopril",
      medicineId: 3,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  if (searchHistory.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-black mb-2">No Search History</h3>
        <p className="text-muted-foreground mb-6">
          Start searching for medicines to build your history
        </p>
        <Button onClick={() => navigate("/search")}>Search Medicines</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {searchHistory.map((item) => (
        <Card
          key={item.id}
          className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{item.query}</h4>
              <p className="text-sm text-muted-foreground">
                {item.timestamp.toLocaleDateString()} at{" "}
                {item.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/search?query=${item.query}`)}
            >
              View Analysis
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SavedMedicinesContent() {
  const [, navigate] = useLocation();

  // Mock saved medicines data
  const savedMedicines = [
    {
      id: 1,
      name: "Aspirin",
      strength: "500mg",
      dosageForm: "Tablet",
      isGeneric: false,
      notes: "My regular pain reliever",
      savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: "Metformin",
      strength: "1000mg",
      dosageForm: "Tablet",
      isGeneric: true,
      notes: "For diabetes management",
      savedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  if (savedMedicines.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-black mb-2">No Saved Medicines</h3>
        <p className="text-muted-foreground mb-6">
          Save medicines from search results to track them here
        </p>
        <Button onClick={() => navigate("/search")}>Search Medicines</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {savedMedicines.map((medicine) => (
        <Card key={medicine.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-black text-foreground">{medicine.name}</h4>
                {medicine.isGeneric && (
                  <Badge className="bg-green-100 text-green-700">Generic</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {medicine.strength} • {medicine.dosageForm}
              </p>
              {medicine.notes && (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  "{medicine.notes}"
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Saved {medicine.savedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/alternatives?medicineId=${medicine.id}`)}
              >
                View Alternatives
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
