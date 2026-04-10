import { describe, it, expect, vi, beforeEach } from "vitest";
import { medicinesRouter } from "./medicines";
import * as db from "../db";
import * as llm from "../_core/llm";

// Mock the database module
vi.mock("../db", () => ({
  searchMedicines: vi.fn(),
  getAlternativesForMedicine: vi.fn(),
  saveMedicineForUser: vi.fn(),
  addToSearchHistory: vi.fn(),
}));

// Mock the LLM module
vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("medicinesRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("search", () => {
    it("should search medicines by query", async () => {
      const mockMedicines = [
        {
          id: 1,
          name: "Aspirin",
          activeIngredients: "Acetylsalicylic acid",
          therapeuticCategory: "Analgesic",
          dosageForm: "Tablet",
          strength: "500mg",
          regulatoryApproval: "FDA",
          isBranded: false,
          isGeneric: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.searchMedicines).mockResolvedValue(mockMedicines);

      const caller = medicinesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.search({ query: "Aspirin" });

      expect(result).toEqual(mockMedicines);
      expect(db.searchMedicines).toHaveBeenCalledWith("Aspirin", 10);
    });

    it("should return empty array on search error", async () => {
      vi.mocked(db.searchMedicines).mockRejectedValue(
        new Error("Database error")
      );

      const caller = medicinesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.search({ query: "Aspirin" });

      expect(result).toEqual([]);
    });
  });

  describe("analyze", () => {
    it("should analyze a medicine and return structured data", async () => {
      const mockLLMResponse = {
        choices: [
          {
            message: {
              content:
                "Therapeutic use: Used for pain relief and fever reduction\nSafety notes: May cause stomach upset\nAffordability tip: Generic versions are available at lower cost",
            },
          },
        ],
      };

      vi.mocked(llm.invokeLLM).mockResolvedValue(mockLLMResponse);

      const caller = medicinesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.analyze({
        medicineName: "Aspirin",
        activeIngredients: "Acetylsalicylic acid",
      });

      expect(result).toHaveProperty("therapeuticUse");
      expect(result).toHaveProperty("commonSideEffects");
      expect(result).toHaveProperty("safetyNotes");
      expect(result).toHaveProperty("affordabilityTip");
      expect(result).toHaveProperty("timestamp");
    });

    it("should return default values on analysis error", async () => {
      vi.mocked(llm.invokeLLM).mockRejectedValue(new Error("LLM error"));

      const caller = medicinesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.analyze({
        medicineName: "Aspirin",
        activeIngredients: "Acetylsalicylic acid",
      });

      expect(result.therapeuticUse).toBe("Unable to generate analysis");
      expect(result.commonSideEffects).toEqual([]);
      expect(result.safetyNotes).toBe("Please consult your healthcare provider");
      expect(result.affordabilityTip).toBe(
        "Ask your pharmacist about cost-saving options"
      );
    });
  });

  describe("save", () => {
    it("should save medicine for authenticated user", async () => {
      vi.mocked(db.saveMedicineForUser).mockResolvedValue(true);

      const caller = medicinesRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" } as any,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.save({
        medicineId: 1,
        notes: "My favorite pain reliever",
      });

      expect(result.success).toBe(true);
      expect(db.saveMedicineForUser).toHaveBeenCalledWith(
        1,
        1,
        "My favorite pain reliever"
      );
    });

    it("should return success false on save error", async () => {
      vi.mocked(db.saveMedicineForUser).mockResolvedValue(false);

      const caller = medicinesRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" } as any,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.save({
        medicineId: 1,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("addToHistory", () => {
    it("should add search to history for authenticated user", async () => {
      vi.mocked(db.addToSearchHistory).mockResolvedValue(true);

      const caller = medicinesRouter.createCaller({
        user: { id: 1, name: "Test User", role: "user" } as any,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.addToHistory({
        query: "Aspirin",
        medicineId: 1,
      });

      expect(result.success).toBe(true);
      expect(db.addToSearchHistory).toHaveBeenCalledWith(1, "Aspirin", 1);
    });
  });
});
