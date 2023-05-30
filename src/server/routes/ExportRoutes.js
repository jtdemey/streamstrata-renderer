import { addJobToQueue } from "../../server/queue.js";
import getExportParams from "../../services/getexportparams.js";
import getExportStatus from "../../services/getexportstatus.js";
import requestExport from "../../services/requestexport.js";

const routes = async (fastify) => {

  /**
   * A) Request export
     * 0) User requests a download with specified view and viewParameters
     * 1) The server generates a unique ID for the export
     * 2) The server responds to the request with the generated export ID
     * 3) The user is redirected to the rendering page, polling the server for status
   * 4) If the queue is full, the user waits, otherwise...
   * 5) After checking for space, the server initiates (or uses) a headless browser session and redirects to the view with viewParameters specified
   * 6) The server uses Puppeteer to record a session for the user's desired length
   * 7) The server exits the headless browser (if the queue is empty?)
   * 8) The server runs an ffmpeg script on the recorded video to add alpha
   * 9) The server indicates a completed status and returns a download link for the completed video
   */

  fastify.post("/", async (request, reply) => {
    // Request body: { view: string; parameters: object[string][any] }
    try {
      await addJobToQueue({
        type: "processExport",
        requestBody: request.body
      });
      reply.code(201);
      return { exportId, status: "Complete" };
    } catch(e) {
      reply.code(500);
      return { status: "Internal server error" };
    }
  });

  fastify.get("/exportparams", async (request, reply) => {
    const exportParams = getExportParams(request.query["export-id"]);
    if (!exportParams) {
      reply.code(404);
      return { status: "Not found" };
    }
    reply.code(200);
    return { exportParams, status: "Complete" };
  });

  fastify.get("/exportstatus", async (request, reply) => {
    const exportInfo = getExportStatus(request.query["export-id"]);
    const { exportStatus, queuePosition } = exportInfo;
    if (!exportInfo) {
      reply.code(404);
      return { status: "Not found" };
    }
    reply.code(200);
    return { exportStatus, queuePosition, status: "Complete" };
  });

};

export default routes;
