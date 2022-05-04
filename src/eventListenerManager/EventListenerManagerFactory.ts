import EventListenerManager from "./EventListenerManager";

class EventListenerManagerFactory {
  static instance: EventListenerManager | undefined;

  static getInstance(): EventListenerManager {
    if (!this.instance) {
      this.instance = new EventListenerManager();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

export default EventListenerManagerFactory;
