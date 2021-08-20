import { EVENT_KEY } from '../schema';

interface EmittedEvent {
  key: EVENT_KEY;
  data?: any;
}

// Event bus
export class Bus {
  private bus: EmittedEvent[];
  private subscriptions: Map<EVENT_KEY, Array<Function>>;

  constructor() {
    this.bus = [];
    this.subscriptions = new Map();
  }

  // assign a method to call when a specific event happens
  // there can be multiple handlers for one event
  subscribe(event: any, handler: Function) {
    if (this.subscriptions.get(event)) {
      this.subscriptions.get(event)?.push(handler);
    } else {
      this.subscriptions.set(event, [handler]);
    }
  }

  // emit an event
  emit(key: EVENT_KEY, data?: any) {
    //this.bus.push({ key, data });
    this.subscriptions.get(key)?.forEach(handler => handler(data));
  }

  // process all events in bus, including those emitted along the way
  process() {
    // using traditional for loop so we process events emitted by handlers
    for (let i = 0; i < this.bus.length; i++) {
      const { key, data } = this.bus[i];
      this.subscriptions.get(key)?.forEach(handler => handler(data));
    }
    this.bus = [];
  }
}