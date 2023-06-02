import { Worker } from "bullmq";
import recordExport from "../services/recordexport.js";
import { logError } from "../server/logger.js";

const worker = new Worker("exportQueue", async job => {
  console.log(job.data.viewParameters);
  if (!job.data.exportId || !job.data.viewParameters) {
    logError(`Failed to start worker; job data not expected shape`);
    return;
  }
  await recordExport(job.data.exportId, job.data.viewParameters);
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
