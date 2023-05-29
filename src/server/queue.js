import { Queue } from 'bullmq'

const queue = new Queue("exportqueue", {
  connection: {
    host: "localhost",
    port: 6379
  }
});

export default queue;
