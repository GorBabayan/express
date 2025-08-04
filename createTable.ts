import { pool } from './db.ts';

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    meta JSONB
  );
`;

(async () => {
    try {
        await pool.query(createTableQuery);
        console.log("Users table created");
    } catch (err: any) {
        console.log("Failed to create table: ", err);
    } finally {
        await pool.end();
    }
})();