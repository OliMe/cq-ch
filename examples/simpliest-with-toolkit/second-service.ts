import { createChannel } from '@olime/cq-ch/es/toolkit';
import { pingQuery, testCommand, testQuery, payloadCommand } from './messages';

const channel = createChannel('test-1');

setInterval(async () => {
  const query = await channel.take(testQuery);
  if (query) {
    console.log('query:', query);
    channel.respond(query, 'test');
  }
  const ping = await channel.take(pingQuery);
  if (ping) {
    console.log('ping query payload', ping.payload);
    channel.respond(ping, 'pong');
  }
}, 5);

setInterval(async () => {
  const command = await channel.take(testCommand);
  if (command) {
    console.log('command:', command);
  }
  await channel.send(payloadCommand({ foo: 'bar' }));
}, 5);
