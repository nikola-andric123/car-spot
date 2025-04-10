//import { boolean } from 'drizzle-orm/mysql-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { Link } from 'expo-router';

export const cars = sqliteTable('cars', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    description: text('description'),
    name: text('name'),
    otherData: text('otherData'),
    page: integer('page'),
    price: text('price'),
    image: text('image'),
    
    isBookmarked: integer('isBookmarked')
    
});

export const storedSearchCriteria = sqliteTable('storedSearchCriteria', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    fuelType: text('fuelType'),
    make: text('make'),
    model: text('model'),
    yearFrom: text('yearFrom'),
    yearTo: text('yearTo'),
    page: integer('page')
});


export type Car = typeof cars.$inferSelect;
//export type SearchCriteria = typeof storedSearchCriteria.$inferSelect;