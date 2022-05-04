import Device, { Platform } from "../device/Device";
import DeviceFactory from "../device/DeviceFactory";
import KeyboardRecorderFactory from "../keyboard/KeyboardRecorderFactory";
import MouseRecorderFactory from "../mouse/MouseRecorderFactory";
import ScrollRecorderFactory from "../scroll/ScrollRecorderFactory";

const keyboardRecorder = KeyboardRecorderFactory.getInstance();
const mouseRecorder = MouseRecorderFactory.getInstance();
const scrollRecorder = ScrollRecorderFactory.getInstance();

enum EventListenerName {
  KEYUP = "keyup",
  KEYDOWN = "keydown",
  KEYPRESS = "keypress",
  MOUSEMOVE = "mousemove",
  MOUSEDOWN = "mousedown",
  MOUSEUP = "mouseup",
  SCROLL = "scroll",
}

const eventListeners = new Map<
  EventListenerName,
  (e: KeyboardEvent | Event | MouseEvent) => void
>([
  [EventListenerName.KEYUP, keyboardRecorder.keyup],
  [EventListenerName.KEYDOWN, keyboardRecorder.keydown],
  [EventListenerName.KEYPRESS, keyboardRecorder.keypress],
  [EventListenerName.MOUSEMOVE, mouseRecorder.mousemove],
  [EventListenerName.MOUSEDOWN, mouseRecorder.mousedown],
  [EventListenerName.MOUSEUP, mouseRecorder.mouseup],
  [EventListenerName.SCROLL, scrollRecorder.scroll],
]);

const desktopEventListenerNames = new Array<EventListenerName>(
  EventListenerName.KEYUP,
  EventListenerName.KEYDOWN,
  EventListenerName.KEYPRESS,
  EventListenerName.MOUSEMOVE,
  EventListenerName.MOUSEDOWN,
  EventListenerName.MOUSEUP,
  EventListenerName.SCROLL
);

const platformEventListeners = new Map<Platform, EventListenerName[]>([
  [Platform.DESKTOP, desktopEventListenerNames],
]);

class EventListenerManager {
  device: Device;
  constructor() {
    this.device = DeviceFactory.getInstance();
  }

  getEventListenersByPlatform = () => {
    const platform = this.device.getPlatform();
    const platformEventListenerNames = platformEventListeners.get(platform);

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
        eventListeners.get(eventListenerName) || (() => {})
      );
    });

    return eventListenersByPlatform;
  };

  registerEventListenersForPlatform = () => {
    if (this.device.getPlatform == null) {
      throw new Error("Platform is not defined");
    }
    const eventListeners = this.getEventListenersByPlatform();
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
}

export default EventListenerManager;
