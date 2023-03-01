const routes = async (fastify, options) => {
  fastify.post("/", async (request, reply) => {
    reply.code(201);
    console.log(request);
    return { good: "hehe" };
  });
};

export default routes;
