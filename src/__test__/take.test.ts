import { take, request } from '..';

describe('take', () => {
  it('should create respond channel successfully', () => {
    expect(take(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('should create take channel unsuccessful', () => {
    // TODO Ignore TS errors because for raw JS we need to test argument validation.
    // @ts-ignore
    const createChannelWithoutArguments = () => take();
    // @ts-ignore
    const createChannelWithFirstIncorrectArgument = () => take('not array');
    const createChannelWithFirstArgumentEmptyArray = () => take([], 'test');
    // @ts-ignore
    const createChannelWithoutSecondArgument = () => take(['test_type']);
    // @ts-ignore
    const createChannelWithSecondIncorrectArgument = () => take(['test_type'], 200);
    expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot();
    expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot();
  });
});

describe('channel created by take function', () => {
  it('should receive messages in order of sending and respond with answers', async () => {
    expect.assertions(4);
    const channel = take(['first_type', 'second_type'], 'first');
    const requestChannel = request(['first_type', 'second_type'], 'second');
    const firstTestQuery = { type: 'first_type' };
    const secondTestQuery = { type: 'second_type' };
    const firstResult = 'first';
    const secondResult = 'second';
    setTimeout(async () => {
      const receivedSecondResult = await requestChannel(secondTestQuery);
      expect(receivedSecondResult).toBe(secondResult);
    }, 25);
    setTimeout(async () => {
      const receivedFirstResult = await requestChannel(firstTestQuery);
      expect(receivedFirstResult).toBe(firstResult);
    }, 20);
    const firstReceivedQuery = await channel();
    expect(firstReceivedQuery).toEqual({
      ...firstTestQuery,
      context: 'second',
      resolve: expect.any(Function),
    });
    firstReceivedQuery && firstReceivedQuery.resolve?.(firstResult);
    const secondReceivedQuery = await channel();
    expect(secondReceivedQuery).toEqual({
      ...secondTestQuery,
      context: 'second',
      resolve: expect.any(Function),
    });
    secondReceivedQuery && secondReceivedQuery.resolve?.(secondResult);
  });
});
