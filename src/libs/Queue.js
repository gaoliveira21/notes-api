import Bee from 'bee-queue';
import redisConfig from '../config/redis';

const jobs = [];

class Queue {
  constructor() {
    this.queue = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queue[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  addJob(queue, job) {
    this.queue[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(({ key }) => {
      const { bee, handle } = this.queue[key];

      bee.process(handle);
    });
  }

  handleFailure(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name} FAILED`, err);
  }
}

export default new Queue();
