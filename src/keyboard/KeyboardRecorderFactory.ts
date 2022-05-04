import KeyboardRecorder from "./KeyboardRecorder";

class KeyboardRecorderFactory {
  static instance: KeyboardRecorder | undefined;

  static getInstance(): KeyboardRecorder {
    if (!this.instance) {
      this.instance = new KeyboardRecorder();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

export default KeyboardRecorderFactory;
