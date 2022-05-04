class MouseMove {
  xDistance: number = 0;
  yDistance: number = 0;
  xDisplacement: number = 0;
  yDisplacement: number = 0;
  speed: number | undefined;
  velocity: number | undefined;
  intervalStartTime: number;
  intervalEndTime: number | undefined;
  startScreenX: number | undefined;
  startScreenY: number | undefined;
  endScreenX: number | undefined;
  endScreenY: number | undefined;

  constructor({
    startScreenX,
    startScreenY,
  }: {
    startScreenX?: number;
    startScreenY?: number;
  } = {}) {
    this.intervalStartTime = new Date().getTime();
    this.startScreenX = startScreenX;
    this.startScreenY = startScreenY;
  }

  intervalEnded() {
    this.intervalEndTime = new Date().getTime();
    this.calculateSpeedAndVelocity();
  }

  calculateSpeedAndVelocity() {
    if (this.intervalEndTime) {
      const interval = this.intervalEndTime - this.intervalStartTime;
      const distance = Math.sqrt(
        Math.pow(this.xDistance, 2) + Math.pow(this.yDistance, 2)
      );
      const displacement = Math.sqrt(
        Math.pow(this.xDisplacement, 2) + Math.pow(this.yDisplacement, 2)
      );
      this.speed = distance / interval;
      this.velocity = displacement / interval;
    }
  }

  getStartCoordinates() {
    return {
      x: this.startScreenX,
      y: this.startScreenY,
    };
  }

  getData() {
    return {
      coordinates: {
        startX: this.startScreenX,
        startY: this.startScreenY,
        endX: this.endScreenX,
        endY: this.endScreenY,
      },
      speed: this.speed,
      velocity: this.velocity,
    };
  }
}

export default MouseMove;
