import db from "../db/db.js";

const createExportRequestTable = db.prepare(`CREATE TABLE IF NOT EXISTS export_requests (
  id INTEGER PRIMARY KEY ASC,
  export_id TEXT NOT NULL,
  parameters TEXT NOT NULL,
  status INTEGER NOT NULL,
  time_completed TEXT NULL,
  time_requested TEXT NOT NULL
)`);

const createSchema = () => createExportRequestTable.run();

export default createSchema;
