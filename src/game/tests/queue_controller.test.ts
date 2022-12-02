import { Queue } from "@/socket";
import { QueueController } from "../queue_controller";

describe('QueueController', () => {
    it('Should return boolean if queue is full or not ', async () => {
        const queueController: QueueController = new QueueController()

        // Queue2
        let queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(false);
        queueController.addToQueue(Queue.queue2);
        queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(false);
        queueController.addToQueue(Queue.queue2);
        queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(true);

        queueController.addToQueue(Queue.queue2);
        queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(false);

        //Queue3
        let queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);
        queueController.addToQueue(Queue.queue3);
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);
        queueController.addToQueue(Queue.queue3);
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);
        queueController.addToQueue(Queue.queue3);
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(true);
  
        queueController.addToQueue(Queue.queue3);
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);

        //Queue4
        let queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4);
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4);
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4);
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4);
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(true);

        queueController.addToQueue(Queue.queue4);
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);

    });

  
})
  