import { command, request } from '@olime/cq-ch';

const sendCommand = command(['test'], 'test-2');
const sendTest2Query = request(['test'], 'test-2');
const sendTest3Query = request(['test'], 'test-3');

setInterval(async () => {
  await sendCommand({ type: 'test', time: Date.now() });
  const result = await sendTest2Query<string>({ type: 'test' }, 2000);
  if (result) {
    console.log('test-2 query result:', result);
  }
}, 1500);

setInterval(async () => {
  const result = await sendTest3Query<string>({ type: 'test' }, 2000);
  if (result) {
    console.log('test-3 query result:', result);
  }
}, 1500);
