import { nanoid } from "nanoid";
import db from "../db/db.js";
import ExportRequestStatuses from "../models/ExportRequestStatuses.js";

const insertExportRequest = db.prepare(
  `INSERT INTO export_requests (export_id, parameters, status, time_requested) VALUES (?, ?, ?, ?)`
);

const requestExport = (params, timeRequested) => {
  insertExportRequest.run(nanoid(24), params, ExportRequestStatuses.Queued, timeRequested);
};

export default requestExport;
