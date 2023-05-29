import db from "../db/db.js";
import ExportRequestStatuses from "../models/ExportRequestStatuses.js";
import { logError } from "../server/logger.js";

const setExportStatusAsError = db.prepare(
  `UPDATE export_requests SET status = ${ExportRequestStatuses.Error} WHERE export_id = ?`
);

const setExportError = async (exportId) => {
  setExportStatusAsError(exportId)
  logError("Set ERROR state", exportId);
};

export default setExportError;
