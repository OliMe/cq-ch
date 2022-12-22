import { execute, respond } from '@olime/cq-ch';

const getNextReceivedCommand = execute(['test'], 'test-1');
const getNextReceivedQuery = respond<string>(['test'], 'test-1');

setInterval(async () => {
  const query = await getNextReceivedQuery();
  if (query) {
    console.log('query:', query);
    query.resolve('test');
  }
}, 5);

setInterval(async () => {
  const command = await getNextReceivedCommand();
  if (command) {
    console.log('command:', command);
  }
}, 5);
