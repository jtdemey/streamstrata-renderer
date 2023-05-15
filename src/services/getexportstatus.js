import db from "../db/db.js";
import ExportRequestStatuses from "../models/ExportRequestStatuses.js";

const selectExportStatus = db.prepare(
  "SELECT status, time_requested, time_completed FROM export_requests WHERE export_id = ?"
);

const selectQueuePosition = timeRequested => db.prepare(
  `SELECT COUNT(*) FROM export_requests WHERE status = '${ExportRequestStatuses.Queued}' AND time_requested > ${timeRequested}`
);

const getExportStatus = (exportId) => {
  const exportStatus = selectExportStatus.get(exportId);
  return {
    exportStatus,
    queuePosition: selectQueuePosition(exportStatus.time_requested).get(exportId)
  };
};

export default getExportStatus;
