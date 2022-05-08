import Device from "../device/Device";
import DeviceFactory from "../device/DeviceFactory";
import EventListenerManager from "../eventListenerManager/EventListenerManager";
import EventListenerManagerFactory from "../eventListenerManager/EventListenerManagerFactory";
import KeyboardRecorder from "../keyboard/KeyboardRecorder";
import KeyboardRecorderFactory from "../keyboard/KeyboardRecorderFactory";
import MouseRecorder from "../mouse/MouseRecorder";
import MouseRecorderFactory from "../mouse/MouseRecorderFactory";

class RecorderManager {
  device: Device;
  eventListener: EventListenerManager;
  keyboardRecorder: KeyboardRecorder;
  mouseRecorder: MouseRecorder;

  constructor() {
    this.device = DeviceFactory.getInstance();
    this.eventListener = EventListenerManagerFactory.getInstance();
    this.keyboardRecorder = KeyboardRecorderFactory.getInstance();
    this.mouseRecorder = MouseRecorderFactory.getInstance();

    this.eventListener.registerEventListenersForPlatform();
  }

  getData = () => {
    return {
      keyboard: this.keyboardRecorder.getData(),
      mouse: this.mouseRecorder.getData(),
    };
  };
}

export default RecorderManager;
