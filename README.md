# Command query channels.
[![codecov](https://codecov.io/gh/OliMe/cq-ch/branch/master/graph/badge.svg?token=EAESO7AKNO)](https://codecov.io/gh/OliMe/cq-ch)

## Motivation

In some cases, JS applications in the browser need to exchange information or perform some actions in response to events in another application that runs with it in the same environment.

This is especially actual for frontend microservice architecture as known as micro frontends.

Of course, you can always use events, but this can easily lead to code pollution, increased interlocking between applications, and vague interfaces.

## Getting Started

### Send command

At first, we need to declare an interface of commands, that our application will send. In order for the library to identify the application or interface, a unique identifier must be passed as the second argument.

As result, we receive a function to send commands of types, defined in our interface. Other types of commands will throw exceptions if we try to send them.

```javascript
import command from '@olime/cq-ch/command';
// Create interface.
const send = command(['FIRST_COMMAD_TYPE', 'SECOND_COMMAND_TYPE'], 'unique-key-of-application');
// Sending command. Command is a simple JS Object with one required field - type.
send({
  type: 'FIRST_COMMAND_TYPE',
  data: 'Hello world.'
});
```

### Receive commands

To receive commands, we need to declare an interface of that commands types.

As a result, function `execute` will return us a function to get the next command of the defined type from the queue.

```javascript
import execute from '@olime/cq-ch/execute';
// Create executed commands interface of application.
const execute = execute(['THIRD_COMMAND_TYPE', 'FOUTH_COMMAND_TYPE'], 'unique-key-of-application');
// Create function for filter incomming messages.
const getCommandsOfThirdType = execute(['THIRD_COMMAND_TYPE']);
// Run checking of new commands in filter channel.
setInterval(async () => {
  const command = await getCommandsOfThirdType();
  if (command) {
    console.log(command);
  }
}, 0);
// Or you can register callback for new events.
// This callback will be called on receiving of new message of type.
getCommandsOfThirdType(async (channel) => {
  const command = await channel();
});
```

### Send queries

To send queries, we need to declare an interface of that queries types.

As a result, function `request` will return us a function to send queries of types, defined in our interface. Queries of other types will throw exceptions if we try to send them.

```javascript
import request from '@olime/cq-ch/request';
// Create interface of sending queries in your application.
const sendQuery = request(['FIRST_QUERY_TYPE'], 'unique-key-of-application');
// Somewhere in your application, request data in async function.
const result = await sendQuery({type: 'FIRST_QUERY_TYPE', data: 'Hello world'});
```

### Получение запросов.

```javascript
import respond from '@olime/cq-ch/respond';
// Create interface of receiving queries in your application.
const getQueryChannel = respond(['THIRD_QUERY_TYPE', 'FOUTH_QUERY_TYPE'], 'unique-key-of-application');
// Create channel for receiving only queries of type THIRD_QUERY_TYPE.
const getQueriesOfThirdType = getQueryChannel('THIRD_QUERY_TYPE');
// Run checking of new received queries in filter channel.
setInterval(async () => {
  const query = await getQueriesOfThirdType();
  if (query) {
    // Respond with data on received query.
    query.resolve({ data: 'Hello world!'});
  }
});
```
