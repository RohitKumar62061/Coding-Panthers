import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface PriceComparisonProps {
  minPrice?: number | null;
  maxPrice?: number | null;
  avgPrice?: number | null;
  pharmacyCount?: number;
  savingsOpportunity?: number | null;
  percentageSavings?: number | null;
  recommendation?: string;
}

export function PriceComparison({
  minPrice,
  maxPrice,
  avgPrice,
  pharmacyCount = 0,
  savingsOpportunity,
  percentageSavings,
  recommendation,
}: PriceComparisonProps) {
  const formatPrice = (price: number | undefined | null) => {
    if (!price) return "N/A";
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Average Price */}
        <Card className="p-4 bg-card border-border">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            AVERAGE PRICE
          </div>
          <div className="text-2xl font-black text-foreground">
            {formatPrice(avgPrice)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Across {pharmacyCount} pharmacies
          </div>
        </Card>

        {/* Lowest Price */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="text-sm font-semibold text-green-700 mb-2">
            LOWEST PRICE
          </div>
          <div className="text-2xl font-black text-green-700">
            {formatPrice(minPrice)}
          </div>
          <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Best deal available
          </div>
        </Card>

        {/* Highest Price */}
        <Card className="p-4 bg-card border-border">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            HIGHEST PRICE
          </div>
          <div className="text-2xl font-black text-foreground">
            {formatPrice(maxPrice)}
          </div>
          {savingsOpportunity && (
            <div className="text-xs text-muted-foreground mt-2">
              Save up to {formatPrice(savingsOpportunity)}
            </div>
          )}
        </Card>
      </div>

      {/* Savings Alert */}
      {percentageSavings !== null && percentageSavings !== undefined && percentageSavings > 0 && (
        <Card
          className={`p-4 border-l-4 ${
            percentageSavings > 30
              ? "bg-blue-50 border-l-accent"
              : "bg-yellow-50 border-l-yellow-400"
          }`}
        >
          <div className="flex items-start gap-3">
            {percentageSavings > 30 ? (
              <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Savings Opportunity: {percentageSavings}%
              </h4>
              <p className="text-sm text-muted-foreground">{recommendation}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

interface PharmacyPriceListProps {
  items: Array<{
    pharmacy?: {
      name: string;
      city?: string | null;
      phone?: string | null;
    };
    price: number;
    inStock: boolean | null;
    lastUpdated: Date;
  }>;
}

export function PharmacyPriceList({ items }: PharmacyPriceListProps) {
  if (items.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No pricing data available
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <Card key={idx} className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">
              {item.pharmacy?.name || "Unknown Pharmacy"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {item.pharmacy?.city} {item.pharmacy?.phone && `• ${item.pharmacy.phone}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-accent">
              ${(item.price / 100).toFixed(2)}
            </div>
            {item.inStock ? (
              <Badge className="bg-green-100 text-green-700 mt-1">
                In Stock
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-700 mt-1">
                Out of Stock
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
