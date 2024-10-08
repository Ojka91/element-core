export interface DomainEvent {
  readonly occurredOn: Date;
}

export class DomainEventEmitter {
  private listeners: Array<(event: DomainEvent) => void> = [];

  emit(event: DomainEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  addListener(listener: (event: DomainEvent) => void) {
    this.listeners.push(listener);
  }
}
