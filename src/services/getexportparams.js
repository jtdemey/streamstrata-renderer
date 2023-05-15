import db from "../db/db.js";

const selectExportParams = db.prepare(
  "SELECT parameters FROM export_requests WHERE export_id = ?"
);

const getExportParams = (exportId) => selectExportParams.get(exportId);

export default getExportParams;
