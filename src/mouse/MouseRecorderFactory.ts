import MouseRecorder from "./MouseRecorder";

class MouseRecorderFactory {
  static instance: MouseRecorder | undefined;

  static getInstance(): MouseRecorder {
    if (!this.instance) {
      this.instance = new MouseRecorder();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

export default MouseRecorderFactory;
