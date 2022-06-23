import execute from '../execute';
import command from '../command';

describe('execute', () => {
  it('should create execute channel successfully', () => {
    expect(execute(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('should create execute channel unsuccessfully', () => {
    const createChannelWithoutArguments = () => execute();
    const createChannelWithFirstIncorrectArgument = () => execute('not array');
    const createChannelWithFirstArgumentEmptyArray = () => execute([], 'test');
    const createChannelWithoutSecondArgument = () => execute(['test_type']);
    const createChannelWithSecondIncorrectArgument = () => execute(['test_type'], 200);
    expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot();
    expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot();
  });
});

describe('channel created by execute function', () => {
  it('should receive commands in order of sending', async () => {
    expect.assertions(2);
    const channel = execute(['first_type', 'second_type'], 'first');
    const commandChannel = command(['first_type', 'second_type'], 'second');
    const firstTestCommand = { type: 'first_type' };
    const secondTestCommand = { type: 'second_type' };
    setTimeout(() => {
      commandChannel(secondTestCommand);
    }, 25);
    setTimeout(() => {
      commandChannel(firstTestCommand);
    }, 20);
    const receive = channel();
    const firstReceivedCommand = await receive();
    expect(firstReceivedCommand).toEqual({ ...firstTestCommand, context: 'second' });
    const secondReceivedCommand = await receive();
    expect(secondReceivedCommand).toEqual({ ...secondTestCommand, context: 'second' });
  });
});
