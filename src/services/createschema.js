import db from "../db/db.js";

const createExportRequestTable = db.prepare(`CREATE TABLE IF NOT EXISTS export_requests (
  id INTEGER PRIMARY KEY ASC,
  parameters TEXT NOT NULL,
  time_completed TEXT NULL,
  time_requested TEXT NOT NULL
)`);

const createSchema = () => createExportRequestTable.run();

export default createSchema;
