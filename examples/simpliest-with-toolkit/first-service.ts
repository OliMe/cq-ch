import { createChannel } from '@olime/cq-ch/es/toolkit';
import { testCommand, testQuery } from './messages';

const firstChannel = createChannel('test-2');
const secondChannel = createChannel('test-3');

setInterval(async () => {
  await firstChannel.send(testCommand());
  const result = await firstChannel.send(testQuery());
  if (result) {
    console.log('test-2 query result:', result);
  }
}, 100);

setInterval(async () => {
  const result = await secondChannel.send(testQuery());
  if (result) {
    console.log('test-3 query result:', result);
  }
}, 100);
