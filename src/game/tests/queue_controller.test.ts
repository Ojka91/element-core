import { Queue } from "@/utils/socketUtils";
import { QueueController } from "../queue_controller";

describe('QueueController', () => {
    it('Should return boolean if queue is full or not ', async () => {
        const queueController: QueueController = new QueueController()

        // Queue2
        let queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(false);
        queueController.addToQueue(Queue.queue2, '1234');
        queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(false);
        queueController.addToQueue(Queue.queue2, '1234');
        queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(true);

        queueController.addToQueue(Queue.queue2,'1234');
        queue2 = queueController.isQueueFull(Queue.queue2);
        expect(queue2).toBe(false);

        //Queue3
        let queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);
        queueController.addToQueue(Queue.queue3, '1234');
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);
        queueController.addToQueue(Queue.queue3, '1234');
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);
        queueController.addToQueue(Queue.queue3, '1234');
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(true);
  
        queueController.addToQueue(Queue.queue3, '1234');
        queue3 = queueController.isQueueFull(Queue.queue3);
        expect(queue3).toBe(false);

        //Queue4
        let queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4, '1234');
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4, '1234');
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4, '1234');
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);
        queueController.addToQueue(Queue.queue4, '1234');
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(true);

        queueController.addToQueue(Queue.queue4, '1234');
        queue4 = queueController.isQueueFull(Queue.queue4);
        expect(queue4).toBe(false);

        queueController.resetQueue(Queue.queue2);
        expect(queue2).toBe(false)

    });

    it('Should delete user from array of users', () => {
        const queueController: QueueController = new QueueController()
        queueController.addToQueue(Queue.queue2, '1234');

        queueController.deleteUserFromArray('1234');
        const data = queueController.getQueueData(Queue.queue2);
        expect(data).toMatchObject({
            number_players: 0,
            max_players_allowed: 2,
            users: []
        })

    });

  
})
  