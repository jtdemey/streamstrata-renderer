import { Worker } from "bullmq";
import recordExport from "../services/recordexport";
import requestExport from "../services/requestexport";

const worker = new Worker("exportQueue", async job => {
  const exportId = await requestExport(job.requestBody);
  await recordExport(exportId);
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

worker.run();
