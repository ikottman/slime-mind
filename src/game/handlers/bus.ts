import { EVENT_KEY } from '../schema';

// Event bus
export class Bus {
  private subscriptions: Map<EVENT_KEY, Array<Function>>;

  constructor() {
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

  // process the emitted event
  emit(key: EVENT_KEY, data?: any) {
    this.subscriptions.get(key)?.forEach(handler => handler(data));
  }
}