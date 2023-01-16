import { createChannel } from '@olime/cq-ch/es/toolkit';
import { testCommand, testQuery, pingQuery, payloadOnlyCommand } from './messages';

const firstChannel = createChannel('test-2');
const secondChannel = createChannel('test-3');

setInterval(async () => {
  await firstChannel.send(testCommand('test'));

  const result = await firstChannel.send(testQuery());
  if (result) {
    console.log('test-2 query result:', result);
  }

  const pong = await firstChannel.send(pingQuery('ping'));
  if (pong) {
    console.log('test-2 ping query result', pong);
  }
}, 100);

setInterval(async () => {
  const result = await secondChannel.send(testQuery());
  if (result) {
    console.log('test-3 query result:', result);
  }

  const commandWithPayload = await secondChannel.take(payloadOnlyCommand);
  if (commandWithPayload && payloadOnlyCommand.match(commandWithPayload)) {
    console.log('payload command foo:', commandWithPayload.payload?.foo);
  }
}, 100);
