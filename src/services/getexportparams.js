import db from "../db/db.js";
import { logError } from "../server/logger.js";

const selectExportParams = db.prepare(
  "SELECT parameters FROM export_requests WHERE export_id = ?"
);

const getExportParams = (exportId) => {
  const result = selectExportParams.get(exportId);
  if (!result.parameters) {
    logError("Cannot get export parameters", exportId);
    return {};
  }
  const parsed = JSON.parse(result.parameters);
  if (!parsed.view || !parsed.parameters) {
    logError("Cannot parse export parameter shape", exportId);
    return {};
  }
  return parsed;
};

export default getExportParams;
