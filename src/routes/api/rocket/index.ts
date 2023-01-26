import { createRocket, updateRocket, rocketList, deleteRocket } from "@controllers/rocket";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post("/rocket", createRocket);

  fastify.post("/:rocketId", updateRocket);

  fastify.get("/rockets", rocketList);

  fastify.delete("/:rocketId", deleteRocket);
};

export default root;
