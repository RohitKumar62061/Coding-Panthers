import { eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  medicines,
  alternatives,
  prices,
  savedMedicines,
  searchHistory,
  prescriptions,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Medicine query helpers
export async function getMedicineByName(name: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(medicines)
    .where(like(medicines.name, `%${name}%`))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function searchMedicines(query: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(medicines)
    .where(like(medicines.name, `%${query}%`))
    .limit(limit);

  return results;
}

export async function getAlternativesForMedicine(medicineId: number) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.originalMedicineId, medicineId));

  return results;
}

export async function saveMedicineForUser(
  userId: number,
  medicineId: number,
  notes?: string
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(savedMedicines).values({
      userId,
      medicineId,
      notes,
    });
    return true;
  } catch (error) {
    console.error("Failed to save medicine:", error);
    return false;
  }
}

export async function getUserSavedMedicines(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(savedMedicines)
    .where(eq(savedMedicines.userId, userId));

  return results;
}

export async function addToSearchHistory(
  userId: number,
  query: string,
  medicineId?: number
) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(searchHistory).values({
      userId,
      searchQuery: query,
      medicineId,
    });
    return true;
  } catch (error) {
    console.error("Failed to add to search history:", error);
    return false;
  }
}

export async function getUserSearchHistory(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(searchHistory)
    .where(eq(searchHistory.userId, userId))
    .limit(limit);

  return results;
}

export async function savePrescription(
  userId: number,
  fileUrl: string,
  extractedMedicines?: string
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(prescriptions).values({
      userId,
      fileUrl,
      extractedMedicines,
    });
    return result;
  } catch (error) {
    console.error("Failed to save prescription:", error);
    return null;
  }
}

export async function getPricesForMedicine(medicineId: number) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select()
    .from(prices)
    .where(eq(prices.medicineId, medicineId));

  return results;
}
