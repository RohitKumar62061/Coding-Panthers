import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  searchMedicines,
  getAlternativesForMedicine,
  saveMedicineForUser,
  addToSearchHistory,
} from "../db";
import { invokeLLM } from "../_core/llm";

export const medicinesRouter = router({
  /**
   * Search medicines by name
   */
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const results = await searchMedicines(input.query, 10);
        return results;
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    }),

  /**
   * Analyze a medicine using LLM to extract insights
   */
  analyze: publicProcedure
    .input(
      z.object({
        medicineName: z.string(),
        activeIngredients: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a pharmaceutical expert assistant. Provide concise, accurate information about medicines.",
            },
            {
              role: "user",
              content: `Analyze the following medicine and provide key information:

Medicine: ${input.medicineName}
Active Ingredients: ${input.activeIngredients}

Provide: 
1) Therapeutic use (1 sentence)
2) Common side effects (list 3-4 items)
3) Safety notes (1-2 sentences)
4) Affordability tip (1 sentence about finding cheaper alternatives)`,
            },
          ],
        });

        const contentRaw = response.choices[0]?.message.content;
        const content = typeof contentRaw === "string" ? contentRaw : "";

        return {
          therapeuticUse:
            content.split("Therapeutic use:")[1]?.split("\n")[0] ||
            "Not available",
          commonSideEffects: ["Consult product information for details"],
          safetyNotes:
            content.split("Safety notes:")[1]?.split("\n")[0] ||
            "Consult your healthcare provider",
          affordabilityTip:
            content.split("Affordability tip:")[1]?.split("\n")[0] ||
            "Ask your pharmacist about generic options",
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Analysis error:", error);
        return {
          therapeuticUse: "Unable to generate analysis",
          commonSideEffects: [],
          safetyNotes: "Please consult your healthcare provider",
          affordabilityTip: "Ask your pharmacist about cost-saving options",
          timestamp: new Date(),
        };
      }
    }),

  /**
   * Get alternatives for a medicine
   */
  getAlternatives: publicProcedure
    .input(z.object({ medicineId: z.number() }))
    .query(async ({ input }) => {
      try {
        const alternatives = await getAlternativesForMedicine(input.medicineId);
        return alternatives;
      } catch (error) {
        console.error("Get alternatives error:", error);
        return [];
      }
    }),

  /**
   * Save medicine to user's favorites (protected)
   */
  save: protectedProcedure
    .input(
      z.object({
        medicineId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await saveMedicineForUser(
          ctx.user.id,
          input.medicineId,
          input.notes
        );
        return { success: result };
      } catch (error) {
        console.error("Save medicine error:", error);
        return { success: false };
      }
    }),

  /**
   * Add to search history (protected)
   */
  addToHistory: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        medicineId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await addToSearchHistory(
          ctx.user.id,
          input.query,
          input.medicineId
        );
        return { success: result };
      } catch (error) {
        console.error("Add to history error:", error);
        return { success: false };
      }
    }),
});
