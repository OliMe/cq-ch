import { command } from '..';
import getTransport from '../event-transport/get-transport';
import { TYPE_COMMAND } from '../constants';

jest.mock('../event-transport/get-transport', () => {
  const trigger = jest.fn();
  return jest.fn(() => ({
    trigger,
  }));
});

describe('command', () => {
  it('creates channel successfully', () => {
    expect(command(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('creates channel unsuccessfully', () => {
    // TODO Ignore TS errors because for raw JS we need to test argument validation.
    // @ts-ignore
    const createChannelWithoutArguments = () => command();
    // @ts-ignore
    const createChannelWithFirstIncorrectArgument = () => command('not array');
    const createChannelWithFirstArgumentEmptyArray = () => command([], 'test');
    // @ts-ignore
    const createChannelWithoutSecondArgument = () => command(['test_type']);
    // @ts-ignore
    const createChannelWithSecondIncorrectArgument = () => command(['test_type'], 200);
    expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot();
    expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot();
  });
});

describe('created by command function', () => {
  const channel = command(['first_type', 'second_type'], 'test');
  it('throws error when incorrect arguments passed', async () => {
    // TODO Ignore TS errors because for raw JS we need to test argument validation.
    // @ts-ignore
    const callChannelWithoutArguments = async () => await channel();
    // @ts-ignore
    const callChannelWithCommandWithoutTypeProperty = async () => await channel({});
    const callChannelWithCommandWithUndefinedType = async () =>
      await channel({ type: 'third_type' });
    await expect(callChannelWithoutArguments).rejects.toThrowErrorMatchingSnapshot();
    await expect(callChannelWithCommandWithoutTypeProperty).rejects.toThrowErrorMatchingSnapshot();
    await expect(callChannelWithCommandWithUndefinedType).rejects.toThrowErrorMatchingSnapshot();
  });
  it('sends command', () => {
    channel({ type: 'first_type' });
    expect(getTransport).toHaveBeenCalledWith(TYPE_COMMAND);
    const { trigger } = getTransport('command');
    expect(trigger).toHaveBeenCalledWith('first_type', {
      type: 'first_type',
      context: 'test',
      timestamp: expect.any(Number),
    });
  });
});
