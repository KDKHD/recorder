import Recorder from "../recorderManager/Recorder";
import KeyPress from "./KeyPress";

const KEY_PRESS_LOOK_BACK = 3;

class KeyboardRecorder extends Recorder {
  keyPressHistory: KeyPress[];

  constructor() {
    super();
    this.keyPressHistory = new Array<KeyPress>();
  }

  keydown = (e: KeyboardEvent | Event | MouseEvent) => {
    if (e instanceof KeyboardEvent) {
      const keyPress = new KeyPress();
      keyPress.keyDown(e);
      this.keyPressHistory.push(keyPress);
    }
  };

  keyup = (e: KeyboardEvent | Event | MouseEvent) => {
    if (e instanceof KeyboardEvent) {
      this.keyPressHistory
        .slice(-KEY_PRESS_LOOK_BACK)
        .reverse()
        .filter((keyPress) => keyPress.isMatchingEvent(e))
        .forEach((keyPress) => keyPress.keyUp(e));
    }
    this.calculateSeekTimes();
    console.table(this.getKeyboardPattern());
  };

  keypress = () => {};

  getKeyboardPattern() {
    return this.keyPressHistory.map((keyPress) => keyPress.getData());
  }

  calculateSeekTimes() {
    return this.keyPressHistory.forEach((keyPress, index, array) => {
      if (index > 0) {
        const previousKeyPress = array[index - 1];
        if (
          keyPress.keyDownEvent?.timeStamp &&
          previousKeyPress.keyDownEvent?.timeStamp
        ) {
          keyPress.seekTime =
            keyPress.keyDownEvent?.timeStamp -
            previousKeyPress.keyDownEvent?.timeStamp;
        }
      }
    });
  }

  clearHistory() {
    this.keyPressHistory = new Array<KeyPress>();
  }
}

export default KeyboardRecorder;
