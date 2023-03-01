import Database from "better-sqlite3";

const db = new Database("streamstrata.db", { verbose: console.log });

export default db;
