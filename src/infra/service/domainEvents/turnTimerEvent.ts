import { DomainEvent } from "../domainEventEmitter";

export class TimerFinishedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly timerId: string) {
    this.occurredOn = new Date();
  }
}
