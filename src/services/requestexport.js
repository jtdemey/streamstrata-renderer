import db from "../db/db.js";

const insertExportRequest = db.prepare(`INSERT INTO export_requests (parameters, time_requested) VALUES (?, ?)`);

const requestExport = (params, timeRequested) => insertExportRequest.run(params, timeRequested);

export default requestExport;
