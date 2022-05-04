import Recorder from "./RecorderManager";

class RecorderManagerFactory {
  static instance: Recorder | undefined;

  static getInstance(): Recorder {
    if (!this.instance) {
      this.instance = new Recorder();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

RecorderManagerFactory.getInstance();

export default RecorderManagerFactory;
