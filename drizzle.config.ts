import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
    out: './drizzle', // output directory for generated files
    dialect: 'sqlite', // database dialect
    driver: 'expo'
} satisfies Config;