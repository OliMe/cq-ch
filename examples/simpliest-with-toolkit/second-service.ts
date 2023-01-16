import { createChannel } from '@olime/cq-ch/es/toolkit';
import {
  pingQuery,
  testCommand,
  testQuery,
  payloadOnlyCommand,
  noPayloadCommand,
} from './messages';

const channel = createChannel('test-1');

setInterval(async () => {
  const message = await channel.take(testQuery, pingQuery, testCommand);
  if (message) {
    if (testQuery.match(message)) {
      console.log('query:', message);
      channel.respond(message, 'test');
    }
    if (pingQuery.match(message)) {
      console.log('ping query payload', message.payload);
      channel.respond(message, 'pong');
    }
    if (testCommand.match(message)) {
      console.log('command:', message);
      console.log('command.payload', message.payload);
      console.log('command.test', message.test);
    }
  }
  await channel.send(payloadOnlyCommand({ foo: 'bar' }));
  await channel.send(noPayloadCommand());
}, 5);
