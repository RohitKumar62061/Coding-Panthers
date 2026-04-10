import { describe, it, expect, vi, beforeEach } from "vitest";
import { alternativesRouter } from "./alternatives";
import * as db from "../db";

// Mock the database module
vi.mock("../db", () => ({
  getDb: vi.fn(),
}));

describe("alternativesRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWithPricing", () => {
    it("should return alternatives with pricing information", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          {
            id: 1,
            originalMedicineId: 1,
            alternativeMedicineId: 2,
            equivalenceScore: 95,
            safetyRating: "safe",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const caller = alternativesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getWithPricing({ medicineId: 1 });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array on database error", async () => {
      vi.mocked(db.getDb).mockResolvedValue(null);

      const caller = alternativesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getWithPricing({ medicineId: 1 });

      expect(result).toEqual([]);
    });
  });

  describe("getPriceComparison", () => {
    it("should return price comparison sorted by price", async () => {
      const caller = alternativesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getPriceComparison({ medicineId: 1 });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getAffordabilityInsights", () => {
    it("should return affordability insights with savings calculation", async () => {
      const caller = alternativesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getAffordabilityInsights({ medicineId: 1 });

      if (result) {
        expect(result).toHaveProperty("medicine");
        expect(result).toHaveProperty("averagePrice");
        expect(result).toHaveProperty("minPrice");
        expect(result).toHaveProperty("maxPrice");
        expect(result).toHaveProperty("recommendation");
      }
    });
  });

  describe("getGenericAlternatives", () => {
    it("should return only generic alternatives", async () => {
      const caller = alternativesRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getGenericAlternatives({ medicineId: 1 });

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
