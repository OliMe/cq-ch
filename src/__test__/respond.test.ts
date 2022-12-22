import respond from '../respond';
import request from '../request';

describe('respond', () => {
  it('should create respond channel successfully', () => {
    expect(respond(['test_type'], 'test')).toBeInstanceOf(Function);
  });
  it('should create respond channel unsuccessful', () => {
    // TODO Ignore TS errors because for raw JS we need to test argument validation.
    // @ts-ignore
    const createChannelWithoutArguments = () => respond();
    // @ts-ignore
    const createChannelWithFirstIncorrectArgument = () => respond('not array');
    const createChannelWithFirstArgumentEmptyArray = () => respond([], 'test');
    // @ts-ignore
    const createChannelWithoutSecondArgument = () => respond(['test_type']);
    // @ts-ignore
    const createChannelWithSecondIncorrectArgument = () => respond(['test_type'], 200);
    expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot();
    expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot();
    expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot();
  });
});

describe('channel created by respond function', () => {
  it('should receive queries in order of sending and respond with answers', async () => {
    expect.assertions(4);
    const channel = respond(['first_type', 'second_type'], 'first');
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
    firstReceivedQuery && firstReceivedQuery.resolve(firstResult);
    const secondReceivedQuery = await channel();
    expect(secondReceivedQuery).toEqual({
      ...secondTestQuery,
      context: 'second',
      resolve: expect.any(Function),
    });
    secondReceivedQuery && secondReceivedQuery.resolve(secondResult);
  });
});
