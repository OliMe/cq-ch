import { createChannel } from '@olime/cq-ch/es/toolkit';
import { pingQuery, testCommand, testQuery, payloadCommand } from './messages';

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
    }
  }
  await channel.send(payloadCommand({ foo: 'bar' }));
}, 5);
