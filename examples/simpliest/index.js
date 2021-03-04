import command from '../../es/command.js';
import execute from '../../es/execute.js';
import request from '../../es/request.js';
import respond from '../../es/respond.js';

const sendCommand = command(['test'], 'test-2');
const sendQuery = request(['test'], 'test-2');
const getNextReceivedCommand = execute(['test'], 'test-1')('test');
const getNextReceivedQuery = respond(['test'], 'test-1')('test');

setInterval(async () => {
    const command = await getNextReceivedCommand();
    const query = await getNextReceivedQuery();
    if (command) {
        console.log('command:', command);
    }
    if (query) {
        console.log('query:', query);
        query.resolve('test');
    }
}, 0);

setInterval(async () => {
    sendCommand({ type: 'test', time: Date.now() });
    const result = await sendQuery({ type: 'test'});
    if (result) {
        console.log('result:', result);
    }
}, 500);
