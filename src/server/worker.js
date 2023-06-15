import { Worker } from "bullmq";
import { log, logError } from "../server/logger.js";
import applyTransparency from "../services/applytransparency.js";
import recordExport from "../services/recordexport.js";

const worker = new Worker("exportQueue", async job => {
  const { exportId, viewParameters } = job.data;
  if (!exportId || !viewParameters) {
    logError(`Failed to start worker; job data not expected shape`);
    return;
  }
  try {
    const rawFileName = await recordExport(exportId, viewParameters);
    const alphaFileName = await applyTransparency(rawFileName);
  } catch(e) {
    logError(e);
  }
  log("Worker job finished", exportId);
}, {
  connection: {
    host: "localhost",
    port: 6379
  }
});

worker.on("error", (err) => {
  logError(err);
});

worker.on("failed", (_, err) => {
  logError(`Worker failed: ${err}`);
});

log("Worker started");
log("---");
