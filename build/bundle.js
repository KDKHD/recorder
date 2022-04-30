"use strict";
class KeyPress {
    constructor(keyDownEvent) {
        this.startTime = undefined;
        this.endTime = undefined;
        this.code = undefined;
        this.keyDown = (event) => {
            this.startTime = Date.now();
            if (event instanceof KeyboardEvent) {
                this.code = event.code;
            }
        };
        this.keyUp = (event) => {
            this.endTime = Date.now();
        };
        this.keyDown(keyDownEvent);
    }
}
System.register("src/Recorder", [], function (exports_1, context_1) {
    "use strict";
    var EventListenerName, Platform, KEY_PRESS_LOOK_BACK, Recorder;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (EventListenerName) {
                EventListenerName["KEYUP"] = "keyup";
                EventListenerName["KEYDOWN"] = "keydown";
                EventListenerName["KEYPRESS"] = "keypress";
                EventListenerName["MOUSEMOVE"] = "mousemove";
                EventListenerName["MOUSEDOWN"] = "mousedown";
                EventListenerName["MOUSEUP"] = "mouseup";
                EventListenerName["SCROLL"] = "scroll";
            })(EventListenerName || (EventListenerName = {}));
            (function (Platform) {
                Platform["DESKTOP"] = "desktop";
            })(Platform || (Platform = {}));
            exports_1("Platform", Platform);
            KEY_PRESS_LOOK_BACK = 3;
            Recorder = class Recorder {
                constructor(config) {
                    this.recording = false;
                    this.keyPressHistory = new Array();
                    this.keydown = (e) => {
                        this.keyPressHistory.push(new KeyPress(e));
                    };
                    this.keyup = (e) => {
                        var _a;
                        if (e instanceof KeyboardEvent) {
                            (_a = this.findLastKeyPressByKeyCode(e.code)) === null || _a === void 0 ? void 0 : _a.keyUp(e);
                        }
                        console.log(this.keyPressHistory);
                    };
                    this.keypress = () => { };
                    this.mousemove = () => { };
                    this.mousedown = () => { };
                    this.mouseup = () => { };
                    this.scroll = () => { };
                    this.getEventListenersByPlatform = (platform) => {
                        const platformEventListenerNames = this.PlatformEventListeners.get(platform);
                        if (platformEventListenerNames === undefined) {
                            throw new Error(`No event listeners for ${platform}`);
                        }
                        const eventListenersByPlatform = new Map();
                        platformEventListenerNames.forEach((eventListenerName) => {
                            eventListenersByPlatform.set(eventListenerName, this.EventListeners.get(eventListenerName) || (() => { }));
                        });
                        return eventListenersByPlatform;
                    };
                    this.registerEventListenersForPlatform = () => {
                        if (this.platform == null) {
                            throw new Error("Platform is not defined");
                        }
                        const eventListeners = this.getEventListenersByPlatform(this.platform);
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
                    this.EventListeners = new Map([
                        [EventListenerName.KEYUP, this.keyup],
                        [EventListenerName.KEYDOWN, this.keydown],
                        [EventListenerName.KEYPRESS, this.keypress],
                        [EventListenerName.MOUSEMOVE, this.mousemove],
                        [EventListenerName.MOUSEDOWN, this.mousedown],
                        [EventListenerName.MOUSEUP, this.mouseup],
                        [EventListenerName.SCROLL, this.scroll],
                    ]);
                    this.DesktopEventListenerNames = new Array(EventListenerName.KEYUP, EventListenerName.KEYDOWN, EventListenerName.KEYPRESS, EventListenerName.MOUSEMOVE, EventListenerName.MOUSEDOWN, EventListenerName.MOUSEUP, EventListenerName.SCROLL);
                    this.PlatformEventListeners = new Map([
                        [Platform.DESKTOP, this.DesktopEventListenerNames],
                    ]);
                    this.platform = (config === null || config === void 0 ? void 0 : config.platform) || Recorder.getPlatform();
                    this.registerEventListenersForPlatform();
                }
                static getPlatform() {
                    return Platform.DESKTOP;
                }
                findLastKeyPressByKeyCode(keyCode) {
                    return this.keyPressHistory
                        .slice(-KEY_PRESS_LOOK_BACK)
                        .reverse()
                        .find((keyPress) => keyPress.code === keyCode);
                }
            };
            exports_1("default", Recorder);
        }
    };
});
System.register("src/Recorder.test", ["src/Recorder"], function (exports_2, context_2) {
    "use strict";
    var Recorder_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (Recorder_1_1) {
                Recorder_1 = Recorder_1_1;
            }
        ],
        execute: function () {
            test("Desktop Recorder initializes eventListeners", () => {
                jest.spyOn(document, "addEventListener");
                new Recorder_1.default({ platform: Recorder_1.Platform.DESKTOP });
                expect(document.addEventListener).toHaveBeenCalledTimes(7);
                expect(document.addEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
                expect(document.addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
                expect(document.addEventListener).toHaveBeenCalledWith("keypress", expect.any(Function));
                expect(document.addEventListener).toHaveBeenCalledWith("mousemove", expect.any(Function));
                expect(document.addEventListener).toHaveBeenCalledWith("mousedown", expect.any(Function));
                expect(document.addEventListener).toHaveBeenCalledWith("mouseup", expect.any(Function));
                expect(document.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
            });
        }
    };
});
System.register("src/RecorderFactory", ["src/Recorder"], function (exports_3, context_3) {
    "use strict";
    var Recorder_2, RecorderFactory;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (Recorder_2_1) {
                Recorder_2 = Recorder_2_1;
            }
        ],
        execute: function () {
            RecorderFactory = class RecorderFactory {
                static getInstance() {
                    if (!this.instance) {
                        this.instance = new Recorder_2.default();
                        // delete instance.constructor;
                    }
                    return this.instance;
                }
            };
            exports_3("default", RecorderFactory);
        }
    };
});
System.register("src/RecorderFactory.test", ["src/Recorder", "src/RecorderFactory"], function (exports_4, context_4) {
    "use strict";
    var Recorder_3, RecorderFactory_1;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (Recorder_3_1) {
                Recorder_3 = Recorder_3_1;
            },
            function (RecorderFactory_1_1) {
                RecorderFactory_1 = RecorderFactory_1_1;
            }
        ],
        execute: function () {
            test("RecorderFactory creates new instance", () => {
                const recorder = RecorderFactory_1.default.getInstance();
                expect(recorder).toBeInstanceOf(Recorder_3.default);
            });
            test("RecorderFactory returns same Recorder when called twice", () => {
                const recorder1 = RecorderFactory_1.default.getInstance();
                const recorder2 = RecorderFactory_1.default.getInstance();
                expect(recorder1).toBe(recorder2);
            });
        }
    };
});
System.register("src/index", ["src/RecorderFactory"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (_1) {
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=bundle.js.map