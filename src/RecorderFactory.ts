import Recorder from "./Recorder";

class RecorderFactory {
  static instance: Recorder | undefined;

  static getInstance(): Recorder {
    if (!this.instance) {
      this.instance = new Recorder();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

export default RecorderFactory;
