CREATE TABLE `alternatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`originalMedicineId` int NOT NULL,
	`alternativeMedicineId` int NOT NULL,
	`equivalenceScore` int,
	`dosageCompatible` boolean DEFAULT true,
	`safetyRating` varchar(50),
	`substitutionNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alternatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medicines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`activeIngredients` text NOT NULL,
	`therapeuticCategory` varchar(255),
	`dosageForm` varchar(100),
	`strength` varchar(100),
	`regulatoryApproval` varchar(255),
	`isBranded` boolean DEFAULT false,
	`isGeneric` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medicines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pharmacies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`city` varchar(100),
	`latitude` varchar(20),
	`longitude` varchar(20),
	`phone` varchar(20),
	`email` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pharmacies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileUrl` text NOT NULL,
	`extractedMedicines` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`medicineId` int NOT NULL,
	`pharmacyId` int NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`inStock` boolean DEFAULT true,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedMedicines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`medicineId` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedMedicines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`medicineId` int,
	`searchQuery` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `alternatives` ADD CONSTRAINT `alternatives_originalMedicineId_medicines_id_fk` FOREIGN KEY (`originalMedicineId`) REFERENCES `medicines`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alternatives` ADD CONSTRAINT `alternatives_alternativeMedicineId_medicines_id_fk` FOREIGN KEY (`alternativeMedicineId`) REFERENCES `medicines`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prices` ADD CONSTRAINT `prices_medicineId_medicines_id_fk` FOREIGN KEY (`medicineId`) REFERENCES `medicines`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prices` ADD CONSTRAINT `prices_pharmacyId_pharmacies_id_fk` FOREIGN KEY (`pharmacyId`) REFERENCES `pharmacies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `savedMedicines` ADD CONSTRAINT `savedMedicines_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `savedMedicines` ADD CONSTRAINT `savedMedicines_medicineId_medicines_id_fk` FOREIGN KEY (`medicineId`) REFERENCES `medicines`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `searchHistory` ADD CONSTRAINT `searchHistory_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `searchHistory` ADD CONSTRAINT `searchHistory_medicineId_medicines_id_fk` FOREIGN KEY (`medicineId`) REFERENCES `medicines`(`id`) ON DELETE no action ON UPDATE no action;