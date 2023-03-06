import db from "../db/db.js";

const selectExportRequest = db.prepare(
  "SELECT parameters FROM export_requests WHERE export_id = ?"
);

const getExportParams = (exportId) => selectExportRequest.get(exportId);

export default getExportParams;
