import ScrollRecorder from "./ScrollRecorder";

class ScrollRecorderFactory {
  static instance: ScrollRecorder | undefined;

  static getInstance(): ScrollRecorder {
    if (!this.instance) {
      this.instance = new ScrollRecorder();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

export default ScrollRecorderFactory;
