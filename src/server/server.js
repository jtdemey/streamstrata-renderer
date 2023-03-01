import Fastify from "fastify";
import Cors from "@fastify/cors";
import dotenv from "dotenv";
import createSchema from "../services/createschema.js";

dotenv.config();

const fastify = Fastify({ logger: true });
fastify.register(Cors, {
  origin: "http://localhost:5173"
});
fastify.register(import("./routes/ExportRoutes.js"));

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    createSchema();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
