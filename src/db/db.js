import Database from "better-sqlite3";

const db = new Database("ll.db", { verbose: console.log });

export default db;
