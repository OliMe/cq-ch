import { Cache, useCache } from '../cache';
import command from '../../command';
import execute from '../../execute';
import request from '../../request';
import respond from '../../respond';

describe('Cache', () => {
  const types = ['test'];
  const context = 'test';
  const cacheInstance = new Cache();
  it('should set and get command channel', () => {
    const initiator = 'command';
    const channel = command(types, context);
    cacheInstance.set(types, context, initiator, channel);
    expect(cacheInstance.get(types, context, initiator)).toBe(channel);
  });
  it('should set and get execute channel', () => {
    const initiator = 'execute';
    const channel = execute(types, context);
    cacheInstance.set(types, context, initiator, channel);
    expect(cacheInstance.get(types, context, initiator)).toBe(channel);
  });
  it('should set and get request channel', () => {
    const initiator = 'request';
    const channel = request(types, context);
    cacheInstance.set(types, context, initiator, channel);
    expect(cacheInstance.get(types, context, initiator)).toBe(channel);
  });
  it('should set and get respond channel', () => {
    const initiator = 'respond';
    const channel = respond(types, context);
    cacheInstance.set(types, context, initiator, channel);
    expect(cacheInstance.get(types, context, initiator)).toBe(channel);
  });
});

describe('useCache', () => {
  it('should create cached command channel creator', () => {
    const cached = useCache(command, 'command');
    const firstTypes = ['test'];
    const firstContext = 'test';
    const firstChannel = cached(firstTypes, firstContext);
    expect(cached(firstTypes, firstContext)).toBe(firstChannel);
    const secondTypes = ['other-test'];
    const secondContext = 'otherTest';
    const secondChannel = cached(secondTypes, secondContext);
    expect(secondChannel).not.toBe(firstChannel);
    expect(cached(secondTypes, secondContext)).toBe(secondChannel);
  });
});
