import command from '../command';
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
    const createChannelWithoutArguments = () => command();
    const createChannelWithFirstIncorrectArgument = () => command('not array');
    const createChannelWithFirstArgumentEmptyArray = () => command([], 'test');
    const createChannelWithoutSecondArgument = () => command(['test_type']);
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
  it('throws error when incorrect arguments passed', () => {
    const callChannelWithoutArguments = () => channel();
    const callChannelWithCommandWithoutTypeProperty = () => channel({});
    const callChannelWithCommandWithUndefinedType = () => channel({ type: 'third_type' });
    expect(callChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(callChannelWithCommandWithoutTypeProperty).toThrowErrorMatchingSnapshot();
    expect(callChannelWithCommandWithUndefinedType).toThrowErrorMatchingSnapshot();
  });
  it('sends command', () => {
    channel({ type: 'first_type' });
    expect(getTransport).toHaveBeenCalledWith(TYPE_COMMAND);
    const { trigger } = getTransport();
    expect(trigger).toHaveBeenCalledWith('first_type', { type: 'first_type', context: 'test' });
  });
});
