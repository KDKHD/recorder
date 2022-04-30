import Recorder from './Recorder';
import RecorderFactory from './RecorderFactory';

test("RecorderFactory creates new instance", () => {
    const recorder = RecorderFactory.getInstance();
    expect(recorder).toBeInstanceOf(Recorder);
});

test("RecorderFactory returns same Recorder when called twice", () => {
    const recorder1 = RecorderFactory.getInstance();
    const recorder2 = RecorderFactory.getInstance();
    expect(recorder1).toBe(recorder2);
});
