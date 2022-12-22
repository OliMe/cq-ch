import { createChannel, createCommand, createQuery } from '../index';

describe('createChannel', () => {
  describe('should create channel', () => {
    it('which sends and receives commands', async () => {
      const firstChannel = createChannel('first-service');
      const secondChannel = createChannel('second-service');

      const firstTestCommand = createCommand<string>('test');
      await firstChannel.send(firstTestCommand('test payload'));
      const commandToSecond = await secondChannel.take(firstTestCommand);
      expect(commandToSecond.type).toBe(firstTestCommand.type);
      expect(commandToSecond.payload).toBe('test payload');

      const secondTestCommand = createCommand('secondTest');
      await secondChannel.send(secondTestCommand());
      const commandToFirst = await firstChannel.take(secondTestCommand);
      expect(commandToFirst.type).toBe(secondTestCommand.type);
      expect(commandToFirst.payload).toBe(undefined);
    });
    it('which sends, receives and responds queries', async () => {
      const firstChannel = createChannel('first-service');
      const secondChannel = createChannel('second-service');
      const settlement = createQuery<number, string>('settlement');

      const promise = firstChannel.send(settlement(123456)).then(settlementName => {
        expect(settlementName).toBe('Екатеринбург');
      });
      const firstQuery = await secondChannel.take(settlement);
      expect(firstQuery.payload).toBe(123456);
      secondChannel.respond(firstQuery, 'Екатеринбург');

      setTimeout(async () => {
        const secondQuery = await firstChannel.take(settlement);
        expect(secondQuery.payload).toBe(234567);
        firstChannel.respond(secondQuery, 'Уфа');
      }, 100);

      const response = await secondChannel.send(settlement(234567));
      expect(response).toBe('Уфа');

      return promise;
    });
  });
});
describe('createCommand', () => {
  it('should create command without payload', () => {
    const testCommandWithoutPayload = createCommand('testCommand');
    expect(testCommandWithoutPayload.type).toBe('testCommand');
    expect(testCommandWithoutPayload.channelType).toBe('command');
    expect(testCommandWithoutPayload()).toEqual({
      type: 'testCommand',
      channelType: 'command',
    });
  });
  it('should create command with payload', () => {
    const testCommandWithPayload = createCommand<{
      test: string;
    }>('testCommand');
    expect(testCommandWithPayload.type).toBe('testCommand');
    expect(testCommandWithPayload.channelType).toBe('command');
    expect(testCommandWithPayload({ test: 'test' })).toEqual({
      payload: { test: 'test' },
      type: 'testCommand',
      channelType: 'command',
    });
  });
  it('should create command with preparing', () => {
    const timestamp = Date.now();
    const preparedTestCommand = createCommand('testCommand', () => ({
      timestamp,
    }));
    expect(preparedTestCommand()).toEqual({
      timestamp,
      type: 'testCommand',
      channelType: 'command',
    });
  });
  it('should return command type on toString() call', () => {
    const testCommandWithoutPayload = createCommand('testCommand');
    expect(testCommandWithoutPayload.toString()).toBe('testCommand');
  });
});
describe('createQuery', () => {
  it('should create query without payload', () => {
    const testQueryWithoutPayload = createQuery<string>('testQuery');
    expect(testQueryWithoutPayload.type).toBe('testQuery');
    expect(testQueryWithoutPayload.channelType).toBe('query');
    expect(testQueryWithoutPayload()).toEqual({
      type: 'testQuery',
      channelType: 'query',
    });
  });
  it('should create query with payload', () => {
    const testQueryWithPayload = createQuery<
      {
        test: string;
      },
      string
    >('testQuery');
    expect(testQueryWithPayload.type).toBe('testQuery');
    expect(testQueryWithPayload.channelType).toBe('query');
    expect(testQueryWithPayload({ test: 'test' })).toEqual({
      payload: { test: 'test' },
      type: 'testQuery',
      channelType: 'query',
    });
  });
  it('should create query with preparing', () => {
    const testQueryWithPrepare = createQuery<string, string>('testQuery', (payload?: string) => ({
      notice: payload,
    }));
    expect(testQueryWithPrepare('Test notice')).toEqual({
      notice: 'Test notice',
      payload: 'Test notice',
      type: 'testQuery',
      channelType: 'query',
    });
  });
  it('should return query type on toString() call', () => {
    const testQueryWithoutPayload = createQuery<string>('testQuery');
    expect(testQueryWithoutPayload.toString()).toBe('testQuery');
  });
});
