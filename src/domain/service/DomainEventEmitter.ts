import DomainEvent from "./domainEvents/DomainEvent";

export class DomainEventEmitter {
  private listeners: Array<(event: DomainEvent) => void> = [];

  emit(event: DomainEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  addListener(listener: (event: DomainEvent) => void) {
    if(this.listeners.includes(listener)){
      this.removeListener(listener);
    }
    this.listeners.push(listener);  
  }

  removeListener(listenerToRemove: (event: DomainEvent) => void) {
    this.listeners.forEach((listener, index) => {
      if(listenerToRemove === listener) this.listeners.splice(index, 1);
    })
  }
}

export class DomainEventEmitterSingleton {

  static domainEventEmitter: DomainEventEmitter;

  constructor() {
      throw new Error('Use DomainEventEmitterSingleton.getInstance()');
  }
  static getInstance() {
      if (!DomainEventEmitterSingleton.domainEventEmitter) {
        DomainEventEmitterSingleton.domainEventEmitter = new DomainEventEmitter();
      }
      return DomainEventEmitterSingleton.domainEventEmitter;
  }
}

export default DomainEventEmitterSingleton;
