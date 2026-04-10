import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Search as SearchIcon, Loader2, AlertCircle, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Search() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Search medicines
  const searchMutation = trpc.medicines.search.useMutation();
  const isSearching = searchMutation.isPending;

  // Get medicine analysis with LLM
  const analysisMutation = trpc.medicines.analyze.useMutation();
  const isAnalyzing = analysisMutation.isPending;

  // Save medicine
  const saveMutation = trpc.medicines.save.useMutation();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const results = await searchMutation.mutateAsync({ query: searchQuery });
      if (results && results.length > 0) {
        setSelectedMedicine(results[0]);
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedMedicine) return;

    try {
      const analysis = await analysisMutation.mutateAsync({
        medicineName: selectedMedicine.name,
        activeIngredients: selectedMedicine.activeIngredients,
      });
      setSelectedMedicine({ ...selectedMedicine, analysis });
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleSaveMedicine = async () => {
    if (!isAuthenticated || !selectedMedicine) return;

    try {
      await saveMutation.mutateAsync({
        medicineId: selectedMedicine.id,
        notes: "",
      });
      alert("Medicine saved to your favorites!");
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-black">Medicine Search</h1>
          </div>
          {isAuthenticated && (
            <span className="text-sm text-muted-foreground">{user?.name}</span>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter medicine name (e.g., Aspirin, Ibuprofen)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-accent hover:bg-accent/90"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        {showAnalysis && selectedMedicine && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Medicine Card */}
            <Card className="p-6 border-accent/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black mb-2">{selectedMedicine.name}</h2>
                  <div className="flex gap-2 flex-wrap">
                    {selectedMedicine.isBranded && (
                      <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded">
                        Branded
                      </span>
                    )}
                    {selectedMedicine.isGeneric && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                        Generic
                      </span>
                    )}
                  </div>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveMedicine}
                    disabled={saveMutation.isPending}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    STRENGTH
                  </h3>
                  <p className="text-lg font-semibold">{selectedMedicine.strength || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    DOSAGE FORM
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedMedicine.dosageForm || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    THERAPEUTIC CATEGORY
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedMedicine.therapeuticCategory || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    REGULATORY APPROVAL
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedMedicine.regulatoryApproval || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  ACTIVE INGREDIENTS
                </h3>
                <p className="text-base">
                  {typeof selectedMedicine.activeIngredients === "string"
                    ? selectedMedicine.activeIngredients
                    : JSON.stringify(selectedMedicine.activeIngredients)}
                </p>
              </div>
            </Card>

            {/* AI Analysis */}
            {!selectedMedicine.analysis && (
              <div className="text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Get AI Analysis & Alternatives"
                  )}
                </Button>
              </div>
            )}

            {selectedMedicine.analysis && (
              <Card className="p-6 bg-blue-50 border-accent/30">
                <h3 className="text-xl font-black mb-4">AI Analysis</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-base text-foreground">
                    {selectedMedicine.analysis.summary}
                  </p>
                </div>
              </Card>
            )}

            {/* Alternatives Section */}
            <Card className="p-6 border-accent/20">
              <h3 className="text-xl font-black mb-4">Generic & Lower-Cost Alternatives</h3>
              <p className="text-muted-foreground">
                Alternatives will be shown here once available in the database.
              </p>
            </Card>

            {/* Price Comparison */}
            <Card className="p-6 border-accent/20">
              <h3 className="text-xl font-black mb-4">Price Comparison</h3>
              <p className="text-muted-foreground">
                Real-time pricing will be displayed once integrated with pharmacy APIs.
              </p>
            </Card>

            {/* Pharmacy Locator */}
            <Card className="p-6 border-accent/20">
              <h3 className="text-xl font-black mb-4">Nearby Pharmacies</h3>
              <p className="text-muted-foreground">
                Pharmacy locator map will be displayed here.
              </p>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!showAnalysis && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">Start Searching</h2>
            <p className="text-muted-foreground">
              Enter a medicine name above to get started. We'll analyze the medicine and show you
              affordable alternatives.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
