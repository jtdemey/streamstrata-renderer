import getExportParams from "../../services/getexportparams.js";

const routes = async (fastify, options) => {
  fastify.post("/", async (request, reply) => {
    reply.code(201);
    // console.log(request.body);
    return { good: "hehe" };
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
};

export default routes;
