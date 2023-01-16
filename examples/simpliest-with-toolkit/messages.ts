import { createCommand, createQuery } from '@olime/cq-ch/es/toolkit';

export const testCommand = createCommand<string, { test: string }>('makeTest', payload => ({
  test: payload,
}));
export const noPayloadCommand = createCommand('noPayloadTest');
export const testQuery = createQuery<string>('getTest');
export const payloadOnlyCommand = createCommand<{ foo: string }>('foo');
export const pingQuery = createQuery<'ping', 'pong'>('testPing');
