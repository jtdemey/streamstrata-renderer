import { nanoid } from "nanoid";
import db from "../db/db.js";
import ExportRequestStatuses from "../models/ExportRequestStatuses.js";
import { log } from "../server/logger.js";

const QUEUE_CAPACITY = 100;

const checkQueue = db.prepare(
  `SELECT COUNT(*) FROM export_requests WHERE status = ${ExportRequestStatuses.Queued}`
);

const insertExportRequest = db.prepare(
  `INSERT INTO export_requests (export_id, parameters, status, time_requested) VALUES (?, ?, ?, ?)`
);

const requestExport = async (params) => {
  const timeRequested = new Date().toISOString();
  const id = nanoid(24);
  log(`Received export request`, id);

  // Check queue capacity
  const queuedCount = checkQueue.get()["COUNT(*)"];
  log(`Queued: ${queuedCount}`);

  if (queuedCount > QUEUE_CAPACITY) {
    insertExportRequest.run(
      id,
      JSON.stringify(params),
      ExportRequestStatuses.Queued, timeRequested
    );
    return id;
  }

  // Record export
  insertExportRequest.run(
    id,
    JSON.stringify(params),
    ExportRequestStatuses.Recording,
    timeRequested
  );
  log("Inserted export request", id);
  return id;
};

export default requestExport;
