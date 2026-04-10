import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Medicines table: Core medicine information
 */
export const medicines = mysqlTable("medicines", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  activeIngredients: text("activeIngredients").notNull(), // JSON string of ingredients
  therapeuticCategory: varchar("therapeuticCategory", { length: 255 }),
  dosageForm: varchar("dosageForm", { length: 100 }), // tablet, capsule, liquid, etc.
  strength: varchar("strength", { length: 100 }), // e.g., "500mg"
  regulatoryApproval: varchar("regulatoryApproval", { length: 255 }), // FDA, EMA, etc.
  isBranded: boolean("isBranded").default(false),
  isGeneric: boolean("isGeneric").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = typeof medicines.$inferInsert;

/**
 * Alternatives table: Links between medicines and their alternatives
 */
export const alternatives = mysqlTable("alternatives", {
  id: int("id").autoincrement().primaryKey(),
  originalMedicineId: int("originalMedicineId").notNull().references(() => medicines.id),
  alternativeMedicineId: int("alternativeMedicineId").notNull().references(() => medicines.id),
  equivalenceScore: int("equivalenceScore"), // 0-100 score for active ingredient equivalence
  dosageCompatible: boolean("dosageCompatible").default(true),
  safetyRating: varchar("safetyRating", { length: 50 }), // safe, caution, contraindicated
  substitutionNotes: text("substitutionNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alternative = typeof alternatives.$inferSelect;
export type InsertAlternative = typeof alternatives.$inferInsert;

/**
 * Prices table: Real-time pricing information
 */
export const prices = mysqlTable("prices", {
  id: int("id").autoincrement().primaryKey(),
  medicineId: int("medicineId").notNull().references(() => medicines.id),
  pharmacyId: int("pharmacyId").notNull().references(() => pharmacies.id),
  price: int("price").notNull(), // stored in cents to avoid float precision issues
  currency: varchar("currency", { length: 3 }).default("USD"),
  inStock: boolean("inStock").default(true),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Price = typeof prices.$inferSelect;
export type InsertPrice = typeof prices.$inferInsert;

/**
 * Pharmacies table: Pharmacy location and contact information
 */
export const pharmacies = mysqlTable("pharmacies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pharmacy = typeof pharmacies.$inferSelect;
export type InsertPharmacy = typeof pharmacies.$inferInsert;

/**
 * Search history table: Track user searches for returning users
 */
export const searchHistory = mysqlTable("searchHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  medicineId: int("medicineId").references(() => medicines.id),
  searchQuery: text("searchQuery"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = typeof searchHistory.$inferInsert;

/**
 * Saved medicines table: Track user's saved/favorite medicines
 */
export const savedMedicines = mysqlTable("savedMedicines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  medicineId: int("medicineId").notNull().references(() => medicines.id),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedMedicine = typeof savedMedicines.$inferSelect;
export type InsertSavedMedicine = typeof savedMedicines.$inferInsert;

/**
 * Prescriptions table: Store uploaded prescription information
 */
export const prescriptions = mysqlTable("prescriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  fileUrl: text("fileUrl").notNull(), // S3 URL
  extractedMedicines: text("extractedMedicines"), // JSON string of parsed medicines
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = typeof prescriptions.$inferInsert;