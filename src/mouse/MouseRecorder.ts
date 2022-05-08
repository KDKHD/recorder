import Recorder from "../recorderManager/Recorder";
import MouseMove from "./MouseMove";

const INTERVAL = 100;

class MouseRecorder extends Recorder {
  xDistance = 0;
  yDistance = 0;
  xDisplacement = 0;
  yDisplacement = 0;
  mouseMoveHistory = new Array<MouseMove>();
  currentScreenX: number | undefined;
  currentScreenY: number | undefined;

  constructor() {
    super();
    this.startInterval();
  }

  updateHistory() {
    const lastMouseMove = this.mouseMoveHistory.at(-1);
    if (lastMouseMove) {
      lastMouseMove.xDistance = this.xDistance;
      lastMouseMove.yDistance = this.yDistance;
      lastMouseMove.xDisplacement = this.xDisplacement;
      lastMouseMove.yDisplacement = this.yDisplacement;
      lastMouseMove.endScreenX = this.currentScreenX;
      lastMouseMove.endScreenY = this.currentScreenY;
      lastMouseMove.intervalEnded();
    }
    this.resetCounters();
    this.mouseMoveHistory.push(
      new MouseMove({
        startScreenX: this.currentScreenX,
        startScreenY: this.currentScreenY,
      })
    );
  }

  startInterval() {
    setInterval(() => {
      this.updateHistory();
      this.resetCounters();
    }, INTERVAL);
  }

  resetCounters() {
    this.xDistance =
      this.yDistance =
      this.xDisplacement =
      this.yDisplacement =
        0;
  }

  mousemove = (e: KeyboardEvent | Event | MouseEvent) => {
    if (e instanceof MouseEvent) {
      this.xDistance += Math.abs(e.movementX);
      this.yDistance += Math.abs(e.movementY);
      this.xDisplacement += e.movementX;
      this.yDisplacement += e.movementY;
      this.currentScreenX = e.screenX;
      this.currentScreenY = e.screenY;
    }
  };
  mousedown = (e: KeyboardEvent | Event | MouseEvent) => {};
  mouseup = (e: KeyboardEvent | Event | MouseEvent) => {};

  getMousePattern() {
    return this.mouseMoveHistory.map((mouseMove) => mouseMove.getData());
  }

  getData() {
    return this.getMousePattern();
  }
}

export default MouseRecorder;
