System.register("device/Device", [], function (exports_1, context_1) {
    "use strict";
    var Platform, Device;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (Platform) {
                Platform["DESKTOP"] = "desktop";
            })(Platform || (Platform = {}));
            exports_1("Platform", Platform);
            Device = class Device {
                getPlatform() {
                    return Platform.DESKTOP;
                }
            };
            exports_1("default", Device);
        }
    };
});
System.register("device/DeviceFactory", ["device/Device"], function (exports_2, context_2) {
    "use strict";
    var Device_1, DeviceFactory;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (Device_1_1) {
                Device_1 = Device_1_1;
            }
        ],
        execute: function () {
            DeviceFactory = class DeviceFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new Device_1.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            exports_2("default", DeviceFactory);
        }
    };
});
System.register("recorderManager/Recorder", [], function (exports_3, context_3) {
    "use strict";
    var Recorder;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Recorder = class Recorder {
                getData() {
                    throw new Error("Method not implemented.");
                }
            };
            exports_3("default", Recorder);
        }
    };
});
System.register("keyboard/KeyPress", [], function (exports_4, context_4) {
    "use strict";
    var KeyPress;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            KeyPress = class KeyPress {
                constructor() {
                    this.keyDownEvent = undefined;
                    this.keyUpEvent = undefined;
                    this.seekTime = undefined;
                    this.pressTime = undefined;
                    this.keyDown = (event) => {
                        this.keyDownEvent = event;
                    };
                    this.keyUp = (event) => {
                        this.keyUpEvent = event;
                        this.calculatePressTime();
                    };
                    this.calculatePressTime = () => {
                        if (this.keyDownEvent && this.keyUpEvent) {
                            this.pressTime = this.keyUpEvent.timeStamp - this.keyDownEvent.timeStamp;
                        }
                    };
                    this.isMatchingEvent = (event) => {
                        var _a, _b;
                        if (event.type === "keydown" && this.keyUpEvent !== undefined) {
                            return ((_a = this.keyUpEvent) === null || _a === void 0 ? void 0 : _a.code) === event.code;
                        }
                        if (event.type === "keyup" && this.keyDownEvent !== undefined) {
                            return ((_b = this.keyDownEvent) === null || _b === void 0 ? void 0 : _b.code) === event.code;
                        }
                        return false;
                    };
                    this.getData = () => {
                        var _a, _b, _c;
                        return {
                            keyDownEventDOMTimeStamp: (_a = this.keyDownEvent) === null || _a === void 0 ? void 0 : _a.timeStamp,
                            keyUpEventDOMTimeStamp: (_b = this.keyUpEvent) === null || _b === void 0 ? void 0 : _b.timeStamp,
                            seekTime: this.seekTime,
                            pressTime: this.pressTime,
                            code: (_c = this.keyDownEvent) === null || _c === void 0 ? void 0 : _c.code,
                        };
                    };
                }
            };
            exports_4("default", KeyPress);
        }
    };
});
System.register("keyboard/KeyboardRecorder", ["recorderManager/Recorder", "keyboard/KeyPress"], function (exports_5, context_5) {
    "use strict";
    var Recorder_1, KeyPress_1, KEY_PRESS_LOOK_BACK, KeyboardRecorder;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (Recorder_1_1) {
                Recorder_1 = Recorder_1_1;
            },
            function (KeyPress_1_1) {
                KeyPress_1 = KeyPress_1_1;
            }
        ],
        execute: function () {
            KEY_PRESS_LOOK_BACK = 3;
            KeyboardRecorder = class KeyboardRecorder extends Recorder_1.default {
                constructor() {
                    super();
                    this.keydown = (e) => {
                        if (e instanceof KeyboardEvent) {
                            const keyPress = new KeyPress_1.default();
                            keyPress.keyDown(e);
                            this.keyPressHistory.push(keyPress);
                        }
                    };
                    this.keyup = (e) => {
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
                    this.keypress = () => { };
                    this.keyPressHistory = new Array();
                }
                getKeyboardPattern() {
                    return this.keyPressHistory.map((keyPress) => keyPress.getData());
                }
                calculateSeekTimes() {
                    return this.keyPressHistory.forEach((keyPress, index, array) => {
                        var _a, _b, _c, _d;
                        if (index > 0) {
                            const previousKeyPress = array[index - 1];
                            if (((_a = keyPress.keyDownEvent) === null || _a === void 0 ? void 0 : _a.timeStamp) &&
                                ((_b = previousKeyPress.keyDownEvent) === null || _b === void 0 ? void 0 : _b.timeStamp)) {
                                keyPress.seekTime =
                                    ((_c = keyPress.keyDownEvent) === null || _c === void 0 ? void 0 : _c.timeStamp) -
                                        ((_d = previousKeyPress.keyDownEvent) === null || _d === void 0 ? void 0 : _d.timeStamp);
                            }
                        }
                    });
                }
            };
            exports_5("default", KeyboardRecorder);
        }
    };
});
System.register("keyboard/KeyboardRecorderFactory", ["keyboard/KeyboardRecorder"], function (exports_6, context_6) {
    "use strict";
    var KeyboardRecorder_1, KeyboardRecorderFactory;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (KeyboardRecorder_1_1) {
                KeyboardRecorder_1 = KeyboardRecorder_1_1;
            }
        ],
        execute: function () {
            KeyboardRecorderFactory = class KeyboardRecorderFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new KeyboardRecorder_1.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            exports_6("default", KeyboardRecorderFactory);
        }
    };
});
System.register("mouse/MouseMove", [], function (exports_7, context_7) {
    "use strict";
    var MouseMove;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            MouseMove = class MouseMove {
                constructor({ startScreenX, startScreenY, } = {}) {
                    this.xDistance = 0;
                    this.yDistance = 0;
                    this.xDisplacement = 0;
                    this.yDisplacement = 0;
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
                        const distance = Math.sqrt(Math.pow(this.xDistance, 2) + Math.pow(this.yDistance, 2));
                        const displacement = Math.sqrt(Math.pow(this.xDisplacement, 2) + Math.pow(this.yDisplacement, 2));
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
                        moveCoordinates: `[(${this.startScreenX},${this.startScreenY}), (${this.endScreenX},${this.endScreenY})]`,
                        speed: this.speed,
                        velocity: this.velocity,
                    };
                }
            };
            exports_7("default", MouseMove);
        }
    };
});
System.register("mouse/MouseRecorder", ["recorderManager/Recorder", "mouse/MouseMove"], function (exports_8, context_8) {
    "use strict";
    var Recorder_2, MouseMove_1, INTERVAL, MouseRecorder;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (Recorder_2_1) {
                Recorder_2 = Recorder_2_1;
            },
            function (MouseMove_1_1) {
                MouseMove_1 = MouseMove_1_1;
            }
        ],
        execute: function () {
            INTERVAL = 1000;
            MouseRecorder = class MouseRecorder extends Recorder_2.default {
                constructor() {
                    super();
                    this.xDistance = 0;
                    this.yDistance = 0;
                    this.xDisplacement = 0;
                    this.yDisplacement = 0;
                    this.mouseMoveHistory = new Array();
                    this.mousemove = (e) => {
                        if (e instanceof MouseEvent) {
                            this.xDistance += Math.abs(e.movementX);
                            this.yDistance += Math.abs(e.movementY);
                            this.xDisplacement += e.movementX;
                            this.yDisplacement += e.movementY;
                            this.currentScreenX = e.screenX;
                            this.currentScreenY = e.screenY;
                        }
                    };
                    this.mousedown = (e) => { };
                    this.mouseup = (e) => { };
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
                    this.mouseMoveHistory.push(new MouseMove_1.default({
                        startScreenX: this.currentScreenX,
                        startScreenY: this.currentScreenY,
                    }));
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
                getMousePattern() {
                    return this.mouseMoveHistory.map((mouseMove) => mouseMove.getData());
                }
            };
            exports_8("default", MouseRecorder);
        }
    };
});
System.register("mouse/MouseRecorderFactory", ["mouse/MouseRecorder"], function (exports_9, context_9) {
    "use strict";
    var MouseRecorder_1, MouseRecorderFactory;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (MouseRecorder_1_1) {
                MouseRecorder_1 = MouseRecorder_1_1;
            }
        ],
        execute: function () {
            MouseRecorderFactory = class MouseRecorderFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new MouseRecorder_1.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            exports_9("default", MouseRecorderFactory);
        }
    };
});
System.register("scroll/ScrollRecorder", [], function (exports_10, context_10) {
    "use strict";
    var ScrollRecorder;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            ScrollRecorder = class ScrollRecorder {
                constructor() {
                    this.scroll = (e) => { };
                }
            };
            exports_10("default", ScrollRecorder);
        }
    };
});
System.register("scroll/ScrollRecorderFactory", ["scroll/ScrollRecorder"], function (exports_11, context_11) {
    "use strict";
    var ScrollRecorder_1, ScrollRecorderFactory;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (ScrollRecorder_1_1) {
                ScrollRecorder_1 = ScrollRecorder_1_1;
            }
        ],
        execute: function () {
            ScrollRecorderFactory = class ScrollRecorderFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new ScrollRecorder_1.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            exports_11("default", ScrollRecorderFactory);
        }
    };
});
System.register("eventListenerManager/EventListenerManager", ["device/Device", "device/DeviceFactory", "keyboard/KeyboardRecorderFactory", "mouse/MouseRecorderFactory", "scroll/ScrollRecorderFactory"], function (exports_12, context_12) {
    "use strict";
    var Device_2, DeviceFactory_1, KeyboardRecorderFactory_1, MouseRecorderFactory_1, ScrollRecorderFactory_1, keyboardRecorder, mouseRecorder, scrollRecorder, EventListenerName, eventListeners, desktopEventListenerNames, platformEventListeners, EventListenerManager;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Device_2_1) {
                Device_2 = Device_2_1;
            },
            function (DeviceFactory_1_1) {
                DeviceFactory_1 = DeviceFactory_1_1;
            },
            function (KeyboardRecorderFactory_1_1) {
                KeyboardRecorderFactory_1 = KeyboardRecorderFactory_1_1;
            },
            function (MouseRecorderFactory_1_1) {
                MouseRecorderFactory_1 = MouseRecorderFactory_1_1;
            },
            function (ScrollRecorderFactory_1_1) {
                ScrollRecorderFactory_1 = ScrollRecorderFactory_1_1;
            }
        ],
        execute: function () {
            keyboardRecorder = KeyboardRecorderFactory_1.default.getInstance();
            mouseRecorder = MouseRecorderFactory_1.default.getInstance();
            scrollRecorder = ScrollRecorderFactory_1.default.getInstance();
            (function (EventListenerName) {
                EventListenerName["KEYUP"] = "keyup";
                EventListenerName["KEYDOWN"] = "keydown";
                EventListenerName["KEYPRESS"] = "keypress";
                EventListenerName["MOUSEMOVE"] = "mousemove";
                EventListenerName["MOUSEDOWN"] = "mousedown";
                EventListenerName["MOUSEUP"] = "mouseup";
                EventListenerName["SCROLL"] = "scroll";
            })(EventListenerName || (EventListenerName = {}));
            eventListeners = new Map([
                [EventListenerName.KEYUP, keyboardRecorder.keyup],
                [EventListenerName.KEYDOWN, keyboardRecorder.keydown],
                [EventListenerName.KEYPRESS, keyboardRecorder.keypress],
                [EventListenerName.MOUSEMOVE, mouseRecorder.mousemove],
                [EventListenerName.MOUSEDOWN, mouseRecorder.mousedown],
                [EventListenerName.MOUSEUP, mouseRecorder.mouseup],
                [EventListenerName.SCROLL, scrollRecorder.scroll],
            ]);
            desktopEventListenerNames = new Array(EventListenerName.KEYUP, EventListenerName.KEYDOWN, EventListenerName.KEYPRESS, EventListenerName.MOUSEMOVE, EventListenerName.MOUSEDOWN, EventListenerName.MOUSEUP, EventListenerName.SCROLL);
            platformEventListeners = new Map([
                [Device_2.Platform.DESKTOP, desktopEventListenerNames],
            ]);
            EventListenerManager = class EventListenerManager {
                constructor() {
                    this.getEventListenersByPlatform = (platform) => {
                        const platformEventListenerNames = platformEventListeners.get(platform);
                        if (platformEventListenerNames === undefined) {
                            throw new Error(`No event listeners for ${platform}`);
                        }
                        const eventListenersByPlatform = new Map();
                        platformEventListenerNames.forEach((eventListenerName) => {
                            eventListenersByPlatform.set(eventListenerName, eventListeners.get(eventListenerName) || (() => { }));
                        });
                        return eventListenersByPlatform;
                    };
                    this.registerEventListenersForPlatform = () => {
                        if (this.device.getPlatform == null) {
                            throw new Error("Platform is not defined");
                        }
                        const eventListeners = this.getEventListenersByPlatform(this.device.getPlatform());
                        this.registerEventListeners(eventListeners);
                    };
                    this.registerEventListeners = (eventListeners) => {
                        eventListeners.forEach((listener, eventListenerName) => {
                            this.registerEventListener(eventListenerName, listener);
                        });
                    };
                    this.registerEventListener = (type, listener) => {
                        document.addEventListener(type, listener);
                    };
                    this.device = DeviceFactory_1.default.getInstance();
                }
            };
            exports_12("default", EventListenerManager);
        }
    };
});
System.register("eventListenerManager/EventListenerManagerFactory", ["eventListenerManager/EventListenerManager"], function (exports_13, context_13) {
    "use strict";
    var EventListenerManager_1, EventListenerManagerFactory;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (EventListenerManager_1_1) {
                EventListenerManager_1 = EventListenerManager_1_1;
            }
        ],
        execute: function () {
            EventListenerManagerFactory = class EventListenerManagerFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new EventListenerManager_1.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            exports_13("default", EventListenerManagerFactory);
        }
    };
});
System.register("recorderManager/RecorderManager", ["device/DeviceFactory", "eventListenerManager/EventListenerManagerFactory", "keyboard/KeyboardRecorderFactory", "mouse/MouseRecorderFactory"], function (exports_14, context_14) {
    "use strict";
    var DeviceFactory_2, EventListenerManagerFactory_1, KeyboardRecorderFactory_2, MouseRecorderFactory_2, RecorderManager;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (DeviceFactory_2_1) {
                DeviceFactory_2 = DeviceFactory_2_1;
            },
            function (EventListenerManagerFactory_1_1) {
                EventListenerManagerFactory_1 = EventListenerManagerFactory_1_1;
            },
            function (KeyboardRecorderFactory_2_1) {
                KeyboardRecorderFactory_2 = KeyboardRecorderFactory_2_1;
            },
            function (MouseRecorderFactory_2_1) {
                MouseRecorderFactory_2 = MouseRecorderFactory_2_1;
            }
        ],
        execute: function () {
            RecorderManager = class RecorderManager {
                constructor() {
                    this.device = DeviceFactory_2.default.getInstance();
                    this.eventListener = EventListenerManagerFactory_1.default.getInstance();
                    this.keyboardRecorder = KeyboardRecorderFactory_2.default.getInstance();
                    this.mouseRecorder = MouseRecorderFactory_2.default.getInstance();
                    this.eventListener.registerEventListenersForPlatform();
                }
            };
            exports_14("default", RecorderManager);
        }
    };
});
System.register("recorderManager/RecorderManagerFactory", ["recorderManager/RecorderManager"], function (exports_15, context_15) {
    "use strict";
    var RecorderManager_1, RecorderManagerFactory;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (RecorderManager_1_1) {
                RecorderManager_1 = RecorderManager_1_1;
            }
        ],
        execute: function () {
            RecorderManagerFactory = class RecorderManagerFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new RecorderManager_1.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            RecorderManagerFactory.getInstance();
            exports_15("default", RecorderManagerFactory);
        }
    };
});
System.register("index", ["recorderManager/RecorderManagerFactory"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (_1) {
            }
        ],
        execute: function () {
        }
    };
});
System.register("eventListenerManager/EventListenerManager.test", [], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=bundle.js.map