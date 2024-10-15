import DomainEvent from "./DomainEvent";

export class TurnTimerFinishedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly timerId: string) {
    this.occurredOn = new Date();
  }
}
