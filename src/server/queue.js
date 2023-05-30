import { Queue } from "bullmq";

const queue = new Queue("exportQueue", {
  connection: {
    host: "localhost",
    port: 6379
  }
});

export const addJobToQueue = async job => await queue.add(job.type, job);

export default queue;
