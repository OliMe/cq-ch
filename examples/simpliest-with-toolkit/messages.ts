import { createCommand, createQuery } from '../../es/toolkit';

export const testCommand = createCommand('test');
export const testQuery = createQuery<string>('test');
export const payloadCommand = createCommand<{ foo: string }>('foo');
export const pingQuery = createQuery<'ping', 'pong'>('test-ping');
