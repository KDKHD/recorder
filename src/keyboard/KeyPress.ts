class KeyPress {
  keyDownEvent: KeyboardEvent | undefined = undefined;
  keyUpEvent: KeyboardEvent | undefined = undefined;
  seekTime: number | undefined = undefined;
  pressTime: number | undefined = undefined;

  constructor() {}

  keyDown = (event: KeyboardEvent) => {
    this.keyDownEvent = event;
  };

  keyUp = (event: KeyboardEvent) => {
    this.keyUpEvent = event;
    this.calculatePressTime()
  };

  calculatePressTime = () => {
    if (this.keyDownEvent && this.keyUpEvent) {
      this.pressTime = this.keyUpEvent.timeStamp - this.keyDownEvent.timeStamp;
    }
  }

  isMatchingEvent = (event: KeyboardEvent) => {
    if (event.type === "keydown" && this.keyUpEvent !== undefined) {
      return this.keyUpEvent?.code === event.code;
    }
    if (event.type === "keyup" && this.keyDownEvent !== undefined) {
      return this.keyDownEvent?.code === event.code;
    }
    return false;
  };

  getData = () => {
    return {
      keyDownEventDOMTimeStamp: this.keyDownEvent?.timeStamp,
      keyUpEventDOMTimeStamp: this.keyUpEvent?.timeStamp,
      seekTime: this.seekTime,
      pressTime: this.pressTime,
      code: this.keyDownEvent?.code,
    };
  }
}

export default KeyPress;
