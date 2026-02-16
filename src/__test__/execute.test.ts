import { execute, command } from '..';

describe('execute', () => {
  it('should create execute channel successfully', () => {
    expect(execute(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('should create execute channel unsuccessfully', () => {
    // @ts-expect-error Ignore TS errors because for raw JS we need to test argument validation.
    const createChannelWithoutArguments = () => execute();
    // @ts-expect-error Same as above.
    const createChannelWithFirstIncorrectArgument = () => execute('not array');
    const createChannelWithFirstArgumentEmptyArray = () => execute([], 'test');
    // @ts-expect-error Same as above.
    const createChannelWithoutSecondArgument = () => execute(['test_type']);
    // @ts-expect-error Same as above.
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
    const firstReceivedCommand = await channel();
    expect(firstReceivedCommand).toEqual({
      ...firstTestCommand,
      context: 'second',
      timestamp: expect.any(Number),
    });
    const secondReceivedCommand = await channel();
    expect(secondReceivedCommand).toEqual({
      ...secondTestCommand,
      context: 'second',
      timestamp: expect.any(Number),
    });
  });
});
