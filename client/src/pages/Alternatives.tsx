import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { PriceComparison, PharmacyPriceList } from "@/components/PriceComparison";

export default function Alternatives() {
  const [, navigate] = useLocation();
  const [medicineId, setMedicineId] = useState<number | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(
    null
  );

  // Get medicine ID from URL or session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("medicineId");
    if (id) {
      setMedicineId(parseInt(id));
    }
  }, []);

  const { data: alternatives, isLoading: altLoading } =
    trpc.alternatives.getWithPricing.useQuery(
      { medicineId: medicineId || 0 },
      { enabled: medicineId !== null }
    );

  const { data: genericAlts, isLoading: genericLoading } =
    trpc.alternatives.getGenericAlternatives.useQuery(
      { medicineId: medicineId || 0 },
      { enabled: medicineId !== null }
    );

  const { data: selectedPricing, isLoading: pricingLoading } =
    trpc.alternatives.getPriceComparison.useQuery(
      { medicineId: selectedAlternative || 0 },
      { enabled: selectedAlternative !== null }
    );

  const { data: affordability } =
    trpc.alternatives.getAffordabilityInsights.useQuery(
      { medicineId: selectedAlternative || 0 },
      { enabled: selectedAlternative !== null }
    );

  if (!medicineId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">No Medicine Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please search for a medicine first to view alternatives.
          </p>
          <Button onClick={() => navigate("/search")} className="w-full">
            Go to Search
          </Button>
        </Card>
      </div>
    );
  }

  const isLoading = altLoading || genericLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/search")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-black">Affordable Alternatives</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : !alternatives || alternatives.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-black mb-2">No Alternatives Found</h3>
            <p className="text-muted-foreground">
              We couldn't find any alternatives for this medicine yet.
            </p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Alternatives List */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="text-lg font-black mb-4">
                  Generic & Lower-Cost Alternatives
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {genericAlts?.length || 0} generic option
                  {(genericAlts?.length || 0) !== 1 ? "s" : ""} available
                </p>
              </div>

              {alternatives.map((alt, idx) => (
                <Card
                  key={idx}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedAlternative === alt.medicine?.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setSelectedAlternative(alt.medicine?.id || null)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-black text-foreground">
                        {alt.medicine?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {alt.medicine?.strength} • {alt.medicine?.dosageForm}
                      </p>
                    </div>
                    {alt.medicine?.isGeneric && (
                      <Badge className="bg-green-100 text-green-700 ml-2">
                        Generic
                      </Badge>
                    )}
                  </div>

                  {/* Active Ingredient Equivalence */}
                  <div className="mb-3 p-2 bg-background rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-foreground">
                        Active Ingredients Match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alt.medicine?.activeIngredients}
                    </p>
                  </div>

                  {/* Dosage Compatibility */}
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Dosage Compatible
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alt.alternative?.equivalenceScore}% Equivalent
                    </Badge>
                  </div>

                  {/* Pricing Summary */}
                  {alt.pricing && (
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Average Price
                        </p>
                        <p className="text-lg font-black text-accent">
                          ${(alt.pricing.avgPrice! / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Available at
                        </p>
                        <p className="text-lg font-black text-foreground">
                          {alt.pricing.pharmacyCount} pharmacies
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Regulatory Approval */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Regulatory Status:{" "}
                      <span className="text-green-600 font-semibold">
                        {alt.medicine?.regulatoryApproval}
                      </span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pricing & Affordability Panel */}
            <div className="lg:col-span-1">
              {selectedAlternative ? (
                <div className="space-y-6 sticky top-24">
                  <Card className="p-4 bg-accent/5 border-accent">
                    <h3 className="font-black text-foreground mb-4">
                      Price Comparison
                    </h3>

                    {pricingLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-accent" />
                      </div>
                    ) : affordability ? (
                      <>
                        <PriceComparison
                          minPrice={affordability.minPrice}
                          maxPrice={affordability.maxPrice}
                          avgPrice={affordability.averagePrice}
                          pharmacyCount={affordability.pharmacyCount}
                          savingsOpportunity={affordability.savingsOpportunity}
                          percentageSavings={affordability.percentageSavings}
                          recommendation={affordability.recommendation}
                        />

                        {/* Pharmacy List */}
                        {selectedPricing && selectedPricing.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="font-semibold text-foreground mb-3">
                              Pharmacies
                            </h4>
                            <PharmacyPriceList items={selectedPricing} />
                          </div>
                        )}
                      </>
                    ) : null}
                  </Card>

                  {/* Safety Alert */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Safety Note
                        </h4>
                        <p className="text-sm text-blue-800">
                          Always consult your healthcare provider before
                          switching medicines, even if they contain the same
                          active ingredients.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>Select an alternative to view pricing and availability</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
