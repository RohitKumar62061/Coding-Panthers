import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { medicines, alternatives, prices, pharmacies } from "../../drizzle/schema";

export const alternativesRouter = router({
  /**
   * Get alternatives for a medicine with pricing information
   */
  getWithPricing: publicProcedure
    .input(z.object({ medicineId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        // Get alternatives
        const alts = await db
          .select()
          .from(alternatives)
          .where(eq(alternatives.originalMedicineId, input.medicineId));

        // Get alternative medicine details with pricing
        const results = await Promise.all(
          alts.map(async (alt) => {
            const medicine = await db
              .select()
              .from(medicines)
              .where(eq(medicines.id, alt.alternativeMedicineId))
              .limit(1);

            const medicineData = medicine[0];

            // Get prices for this alternative
            const priceData = await db
              .select()
              .from(prices)
              .where(eq(prices.medicineId, alt.alternativeMedicineId));

            const minPrice =
              priceData.length > 0
                ? Math.min(...priceData.map((p) => p.price))
                : null;
            const maxPrice =
              priceData.length > 0
                ? Math.max(...priceData.map((p) => p.price))
                : null;
            const avgPrice =
              priceData.length > 0
                ? Math.round(
                    priceData.reduce((sum, p) => sum + p.price, 0) /
                      priceData.length
                  )
                : null;

            return {
              alternative: alt,
              medicine: medicineData,
              pricing: {
                minPrice,
                maxPrice,
                avgPrice,
                pharmacyCount: priceData.length,
              },
            };
          })
        );

        return results;
      } catch (error) {
        console.error("Get alternatives error:", error);
        return [];
      }
    }),

  /**
   * Get price comparison for a medicine across all pharmacies
   */
  getPriceComparison: publicProcedure
    .input(z.object({ medicineId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const priceData = await db
          .select()
          .from(prices)
          .where(eq(prices.medicineId, input.medicineId));

        // Get pharmacy details for each price
        const comparison = await Promise.all(
          priceData.map(async (price) => {
            const pharmacy = await db
              .select()
              .from(pharmacies)
              .where(eq(pharmacies.id, price.pharmacyId))
              .limit(1);

            return {
              price: price.price,
              currency: price.currency,
              inStock: price.inStock,
              pharmacy: pharmacy[0],
              lastUpdated: price.lastUpdated,
            };
          })
        );

        // Sort by price (lowest first)
        return comparison.sort((a, b) => a.price - b.price);
      } catch (error) {
        console.error("Get price comparison error:", error);
        return [];
      }
    }),

  /**
   * Calculate affordability insights for a medicine
   */
  getAffordabilityInsights: publicProcedure
    .input(z.object({ medicineId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return null;

        // Get medicine details
        const medicine = await db
          .select()
          .from(medicines)
          .where(eq(medicines.id, input.medicineId))
          .limit(1);

        if (!medicine[0]) return null;

        // Get all prices for this medicine
        const priceData = await db
          .select()
          .from(prices)
          .where(eq(prices.medicineId, input.medicineId));

        if (priceData.length === 0) {
          return {
            medicine: medicine[0],
            averagePrice: null,
            minPrice: null,
            maxPrice: null,
            savingsOpportunity: null,
            percentageSavings: null,
            recommendation: "No pricing data available",
          };
        }

        const prices_array = priceData.map((p) => p.price);
        const minPrice = Math.min(...prices_array);
        const maxPrice = Math.max(...prices_array);
        const avgPrice = Math.round(
          prices_array.reduce((a, b) => a + b, 0) / prices_array.length
        );

        const savingsOpportunity = avgPrice - minPrice;
        const percentageSavings = Math.round(
          ((savingsOpportunity / avgPrice) * 100) as any
        );

        let recommendation = "Check multiple pharmacies for best prices";
        if (percentageSavings > 30) {
          recommendation =
            "Significant savings available! Consider buying from the cheapest pharmacy.";
        } else if (percentageSavings > 15) {
          recommendation =
            "Moderate savings available. Compare prices before purchasing.";
        }

        return {
          medicine: medicine[0],
          averagePrice: avgPrice,
          minPrice,
          maxPrice,
          savingsOpportunity,
          percentageSavings,
          recommendation,
          pharmacyCount: priceData.length,
        };
      } catch (error) {
        console.error("Get affordability insights error:", error);
        return null;
      }
    }),

  /**
   * Get generic alternatives for a branded medicine
   */
  getGenericAlternatives: publicProcedure
    .input(z.object({ medicineId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        // Get alternatives
        const alts = await db
          .select()
          .from(alternatives)
          .where(eq(alternatives.originalMedicineId, input.medicineId));

        // Filter for generic alternatives only
        const genericAlts = await Promise.all(
          alts.map(async (alt) => {
            const medicine = await db
              .select()
              .from(medicines)
              .where(eq(medicines.id, alt.alternativeMedicineId))
              .limit(1);

            return { alternative: alt, medicine: medicine[0] };
          })
        );

        return genericAlts.filter((item) => item.medicine?.isGeneric);
      } catch (error) {
        console.error("Get generic alternatives error:", error);
        return [];
      }
    }),
});
