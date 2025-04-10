CREATE TABLE `cars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text,
	`name` text,
	`otherData` text,
	`page` integer,
	`price` text,
	`image` text,
	`link` text,
	`isBookmarked` integer
);
--> statement-breakpoint
CREATE TABLE `storedSearchCriteria` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fuelType` text,
	`make` text,
	`model` text,
	`yearFrom` text,
	`yearTo` text,
	`page` integer
);
