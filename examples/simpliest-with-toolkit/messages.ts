import { createCommand, createQuery } from '../../es/toolkit';

export const testCommand = createCommand<string>('makeTest');
export const testQuery = createQuery<string>('getTest');
export const payloadCommand = createCommand<{ foo: string }>('foo');
export const pingQuery = createQuery<'ping', 'pong'>('testPing');
