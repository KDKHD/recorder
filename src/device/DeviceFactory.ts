import Device from "./Device";

class DeviceFactory {
  static instance: Device | undefined;

  static getInstance(): Device {
    if (!this.instance) {
      this.instance = new Device();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

export default DeviceFactory;
