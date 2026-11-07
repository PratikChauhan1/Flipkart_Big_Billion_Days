const { v4: uuidv4 } = require('uuid');

/**
 * OrderQueue: High-concurrency Order Processing Queue
 * Simulates Big Billion Day rush where multiple users checkout at the same instant.
 * Handles inventory deduction atomically, preventing overselling, and updates order states.
 */
class OrderQueue {
  constructor() {
    this.queue = [];
    this.jobsMap = new Map();
    this.isProcessing = false;
    this.stats = {
      totalEnqueued: 0,
      totalCompleted: 0,
      totalFailed: 0,
      peakQueueLength: 0,
      lastProcessedAt: null
    };
    this.dbHandler = null; // Will be set by server
  }

  setDbHandler(handler) {
    this.dbHandler = handler;
  }

  /**
   * Enqueue a new order job
   */
  enqueue(orderData) {
    const jobId = 'JOB_' + uuidv4().substring(0, 8).toUpperCase();
    const orderNumber = 'OD' + Date.now() + Math.floor(Math.random() * 900 + 100);

    const job = {
      jobId,
      orderNumber,
      orderData: {
        ...orderData,
        orderNumber
      },
      status: 'QUEUED', // QUEUED | PROCESSING | CONFIRMED | FAILED
      position: this.queue.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result: null,
      error: null
    };

    this.queue.push(job);
    this.jobsMap.set(jobId, job);
    this.jobsMap.set(orderNumber, job);

    this.stats.totalEnqueued++;
    if (this.queue.length > this.stats.peakQueueLength) {
      this.stats.peakQueueLength = this.queue.length;
    }

    // Trigger queue processor
    this.processNext();

    return {
      jobId,
      orderNumber,
      initialPosition: job.position,
      status: 'QUEUED',
      message: 'Order placed in Big Billion Day processing queue'
    };
  }

  /**
   * Get job status by jobId or orderNumber
   */
  getJobStatus(identifier) {
    const job = this.jobsMap.get(identifier);
    if (!job) return null;

    // Recalculate dynamic position if still in queue
    let currentPosition = 0;
    if (job.status === 'QUEUED') {
      const idx = this.queue.findIndex(j => j.jobId === job.jobId);
      currentPosition = idx !== -1 ? idx + 1 : 1;
    }

    return {
      ...job,
      currentPosition
    };
  }

  getStats() {
    return {
      activeQueueLength: this.queue.length,
      ...this.stats
    };
  }

  /**
   * Process items in queue sequentially
   */
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const currentJob = this.queue.shift();

    if (!currentJob) {
      this.isProcessing = false;
      return;
    }

    currentJob.status = 'PROCESSING';
    currentJob.updatedAt = new Date().toISOString();

    try {
      // Simulate real-world high volume queue delay (300ms - 600ms) for visual queue demonstration
      await new Promise(resolve => setTimeout(resolve, 500));

      if (this.dbHandler && typeof this.dbHandler.processOrder === 'function') {
        const orderResult = await this.dbHandler.processOrder(currentJob.orderData);
        
        if (orderResult.success) {
          currentJob.status = 'CONFIRMED';
          currentJob.result = orderResult.order;
          this.stats.totalCompleted++;
        } else {
          currentJob.status = 'FAILED';
          currentJob.error = orderResult.message;
          this.stats.totalFailed++;
        }
      } else {
        currentJob.status = 'CONFIRMED';
        currentJob.result = currentJob.orderData;
        this.stats.totalCompleted++;
      }
    } catch (err) {
      currentJob.status = 'FAILED';
      currentJob.error = err.message;
      this.stats.totalFailed++;
    } finally {
      currentJob.updatedAt = new Date().toISOString();
      this.stats.lastProcessedAt = new Date().toISOString();
      this.isProcessing = false;

      // Process next item in queue
      if (this.queue.length > 0) {
        setImmediate(() => this.processNext());
      }
    }
  }
}

const orderQueue = new OrderQueue();
module.exports = orderQueue;
