import getTransport from '../get-transport';
import EventTargetTransport from '../event-target-transport';

jest.mock('../../constants', () => {
  const actual = jest.requireActual('../../constants');
  return {
    __esModule: true,
    ...actual,
    IS_BROWSER: false,
  };
});

describe('getTransport', () => {
  it('should assign EventTargetTransport instance on global, when window does not exist', () => {
    expect(global.CQChannels).toBeUndefined();
    const transport = getTransport('test');
    expect(transport).toBeInstanceOf(EventTargetTransport);
    expect(global.CQChannels.test).toBe(transport);
  });
});
