import { createCommand, createQuery } from '../../es/toolkit';

export const testCommand = createCommand('test');
export const testQuery = createQuery<string>('test');
