enum EventListenerName {
  KEYUP = "keyup",
  KEYDOWN = "keydown",
  KEYPRESS = "keypress",
  MOUSEMOVE = "mousemove",
  MOUSEDOWN = "mousedown",
  MOUSEUP = "mouseup",
  SCROLL = "scroll",
}

export enum Platform {
  DESKTOP = "desktop",
}

type Config = {
  platform?: Platform;
};

const KEY_PRESS_LOOK_BACK = 3;

class Recorder {
  platform: Platform;
  recording: Boolean = false;
  currentKeyPress: KeyPress | undefined;
  keyPressHistory = new Array<KeyPress>();

  constructor(config?: Config) {
    this.platform = config?.platform || Recorder.getPlatform();

    this.registerEventListenersForPlatform();
  }

  static getPlatform() {
    return Platform.DESKTOP;
  }

  keydown = (e: KeyboardEvent | Event | MouseEvent) => {
    this.keyPressHistory.push(new KeyPress(e));
  };

  keyup = (e: KeyboardEvent | Event | MouseEvent) => {
    if (e instanceof KeyboardEvent) {
      this.findLastKeyPressByKeyCode(e.code)?.keyUp(e);
    }
    console.log(this.keyPressHistory);
  };

  keypress = () => {};
  mousemove = () => {};
  mousedown = () => {};
  mouseup = () => {};
  scroll = () => {};

  findLastKeyPressByKeyCode(keyCode: string) {
    return this.keyPressHistory
      .slice(-KEY_PRESS_LOOK_BACK)
      .reverse()
      .find((keyPress) => keyPress.code === keyCode);
  }

  getEventListenersByPlatform = (platform: Platform) => {
    const platformEventListenerNames =
      this.PlatformEventListeners.get(platform);

    if (platformEventListenerNames === undefined) {
      throw new Error(`No event listeners for ${platform}`);
    }

    const eventListenersByPlatform = new Map<
      EventListenerName,
      (e: KeyboardEvent | Event | MouseEvent) => void
    >();

    platformEventListenerNames.forEach((eventListenerName) => {
      eventListenersByPlatform.set(
        eventListenerName,
        this.EventListeners.get(eventListenerName) || (() => {})
      );
    });

    return eventListenersByPlatform;
  };

  registerEventListenersForPlatform = () => {
    if (this.platform == null) {
      throw new Error("Platform is not defined");
    }
    const eventListeners = this.getEventListenersByPlatform(this.platform);
    this.registerEventListeners(eventListeners);
  };

  registerEventListeners = (
    eventListeners: Map<
      EventListenerName,
      (e: KeyboardEvent | Event | MouseEvent) => void
    >
  ) => {
    eventListeners.forEach((listener, eventListenerName) => {
      this.registerEventListener(eventListenerName, listener);
    });
  };

  registerEventListener = (
    type: EventListenerName,
    listener: (e: KeyboardEvent | Event | MouseEvent) => void
  ) => {
    document.addEventListener(type, listener);
  };

  EventListeners = new Map<
    EventListenerName,
    (e: KeyboardEvent | Event | MouseEvent) => void
  >([
    [EventListenerName.KEYUP, this.keyup],
    [EventListenerName.KEYDOWN, this.keydown],
    [EventListenerName.KEYPRESS, this.keypress],
    [EventListenerName.MOUSEMOVE, this.mousemove],
    [EventListenerName.MOUSEDOWN, this.mousedown],
    [EventListenerName.MOUSEUP, this.mouseup],
    [EventListenerName.SCROLL, this.scroll],
  ]);

  DesktopEventListenerNames = new Array<EventListenerName>(
    EventListenerName.KEYUP,
    EventListenerName.KEYDOWN,
    EventListenerName.KEYPRESS,
    EventListenerName.MOUSEMOVE,
    EventListenerName.MOUSEDOWN,
    EventListenerName.MOUSEUP,
    EventListenerName.SCROLL
  );

  PlatformEventListeners = new Map<Platform, EventListenerName[]>([
    [Platform.DESKTOP, this.DesktopEventListenerNames],
  ]);
}

export default Recorder;
