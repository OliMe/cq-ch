import { createChannel } from '@olime/cq-ch/es/toolkit';
import { testCommand, testQuery } from './messages';

const channel = createChannel('test-1');

setInterval(async () => {
  const query = await channel.take(testQuery);
  if (query) {
    console.log('query:', query);
    channel.respond(query, 'test');
  }
}, 5);

setInterval(async () => {
  const command = await channel.take(testCommand);
  if (command) {
    console.log('command:', command);
  }
}, 5);
