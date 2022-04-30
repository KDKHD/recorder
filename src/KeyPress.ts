class KeyPress {
  startTime: number | undefined = undefined;
  endTime: number | undefined = undefined;
  code: string | undefined = undefined;

  constructor(keyDownEvent: KeyboardEvent | Event | MouseEvent) {
    this.keyDown(keyDownEvent);
  }

  keyDown = (event: KeyboardEvent | Event | MouseEvent) => {
    this.startTime = Date.now();
    if (event instanceof KeyboardEvent) {
      this.code = event.code;
    }
  };

  keyUp = (event: KeyboardEvent | Event | MouseEvent) => {
    this.endTime = Date.now();
  };
}
