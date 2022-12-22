import getTransport from '../get-transport';
import EventTargetTransport from '../event-target-transport';

describe('getTransport', () => {
  afterEach(() => {
    window.CQChannels = undefined;
    global.CQChannels = undefined;
  });
  it('should create EventTargetTransport instance on global object when it does not exist yet.', () => {
    expect(window.CQChannels).toBeUndefined();
    const transport = getTransport('test');
    expect(transport).toBeInstanceOf(EventTargetTransport);
    expect(window?.CQChannels?.test).toBeInstanceOf(EventTargetTransport);
    expect(window?.CQChannels?.test).toBe(transport);
  });
  it('shouldn`t create EventTargetTransport instance when it already exist.', () => {
    const transport = getTransport('test');
    expect(transport).toBeInstanceOf(EventTargetTransport);
    const sameTransport = getTransport('test');
    expect(sameTransport).toBeInstanceOf(EventTargetTransport);
    expect(sameTransport).toBe(transport);
  });
});
