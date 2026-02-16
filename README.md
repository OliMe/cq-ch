# Command query channels

[![codecov](https://codecov.io/gh/OliMe/cq-ch/branch/master/graph/badge.svg?token=EAESO7AKNO)](https://codecov.io/gh/OliMe/cq-ch)

## Motivation

In some cases, JS applications in the browser need to exchange information or perform some actions in response to events in another application that runs with it in the same environment.

This is especially actual for frontend microservice architecture as known as micro frontends.

Of course, you can always use events, but this can easily lead to code pollution, increased interlocking between applications, and vague interfaces.

## Getting started with base cq-ch

### Send command

At first, we need to declare an interface of commands, that our application will send. In order for the library to identify the application or interface, a unique identifier must be passed as the second argument.

As result, we receive a function to send commands of types, defined in our interface. Other types of commands will throw exceptions if we try to send them.

```javascript
import { command } from '@olime/cq-ch';
// Create interface.
const send = command(['FIRST_COMMAD_TYPE', 'SECOND_COMMAND_TYPE'], 'unique-key-of-application');
// Sending command. Command is a simple JS Object with one required field - type.
send({
  type: 'FIRST_COMMAND_TYPE',
  data: 'Hello world.',
});
```

### Receive commands

To receive commands, we need to declare an interface of that commands types.

As a result, function `execute` will return a function.
If we call the resulting function, with the command type (or array of types), we get an asynchronous function,
each call of which will return us the next received command object of the passed type(s).

```javascript
import { execute } from '@olime/cq-ch';
// Create executed commands interface of application.
const takeCommand = execute(
  ['THIRD_COMMAND_TYPE', 'FOUTH_COMMAND_TYPE'],
  'unique-key-of-application',
);
// Run checking of new commands in filter channel.
setInterval(async () => {
  const command = await takeCommand();
  if (command) {
    console.log(command);
  }
}, 3);
```

### Send queries

To send queries, we need to declare an interface of that queries types.

As a result, function `request` will return us a function to send queries of types, defined in our interface.
Queries of other types will throw exceptions if we try to send them.

```javascript
import { request } from '@olime/cq-ch';
// Create interface of sending queries in your application.
const sendQuery = request(['FIRST_QUERY_TYPE'], 'unique-key-of-application');
// Somewhere in your application, request data in async function.
const result = await sendQuery({ type: 'FIRST_QUERY_TYPE', data: 'Hello world' });
```

### Receiving queries

To receive queries, we need to declare an interface of that query types.

As a result, function `respond` will return a function.
If we call the resulting function, with the request type (or array of types), we get an asynchronous function,
each call of which will return us the next received request object of the passed type(s).

```javascript
import { respond } from '@olime/cq-ch';
// Create interface of receiving queries in your application.
const takeQuery = respond(['THIRD_QUERY_TYPE', 'FOUTH_QUERY_TYPE'], 'unique-key-of-application');
// Run checking of new received queries in filter channel.
setInterval(async () => {
  const query = await takeQuery();
  if (query) {
    // Respond with data on received query.
    query.resolve({ data: 'Hello world!' });
  }
}, 2);
```

### Receiving messages without separation on commands and queries

To receive messages without separation, we can use `take` function and declare interface with it.

```javascript
import { take } from '@olime/cq-ch';
// Create interface of receiving queries in your application.
const takeMessage = take(
  ['THIRD_QUERY_TYPE', 'FOUTH_QUERY_TYPE', 'FIRST_COMMAND_TYPE'],
  'unique-key-of-application',
);
// Run checking of new received queries in filter channel.
setInterval(async () => {
  const message = await takeMessage();
  if (message) {
    // Respond with data on received query.
    message.resolve?.({ data: 'Hello world!' });
    // Do something else with message.
    console.log(message);
  }
}, 2);
```

## Getting started with toolkit

If you want to decrease amount of boilerplate code, you can use `@olime/cq-ch/es/toolkit`.
It's wrapper under raw base library with some useful functions for creating messages and process them.

At first, we need to create channel for sending and receiving messages. Then create message creator function and send message with send method of channel.

```typescript
import { createChannel, createCommand, createQuery } from '@olime/cq-ch/es/toolkit';
// Create channel for sending and receiving messages.
const channel = createChannel('unique-key-of-application');
// Create command creator with payload type definition.
const testCommand = createCommand<string>('FIRST_COMMAND_TYPE');
// Create query creator with payload and response type definitions.
const pingQuery = createQuery<'ping', 'pong'>('PING');
// Create and send command with payload.
channel.send(testCommand('Hello'));
// Create and send query with payload, and receive response.
const pong = await channel.send(pingQuery('ping'));
// pong variable value is 'pong'.
```

You can separate the message creator functions into a separate package.

```typescript
// Inside a message contract package, for example @acme/messages
import { createCommand } from '@olime/cq-ch/es/toolkit';
import { createQuery } from './index';

export const firstCommand = createCommand<string>('FIRST_COMMAND_TYPE');
export const secondCommand = createCommand<{ testProperty: string }>('SECOND_COMMAND_TYPE');
export const pingQuery = createQuery<'ping', 'pong'>('PING');
```

And use them in specific applications as a contract.

```typescript
// Inside a specific application
import { firstCommand, secondCommand, pingQuery } from '@acme/messages';
import { createChannel } from '@olime/cq-ch/es/toolkit';
// Create channel for sending and receiving messages.
const channel = createChannel('unique-key-of-application');
// Create and send first command with payload.
channel.send(firstCommand('Hello'));
// Create and send second command with payload.
channel.send(secondCommand({ testProperty: 'hello' }));
// Create and send ping query.
const pong = channel.send(pingQuery('ping'));
// Process input messages.
setInterval(async () => {
  // Receive messages.
  const message = await channel.take(pingQuery, firstCommand);
  if (message) {
    if (firstCommand.match(message)) {
      // Make some good stuff with received command.
    }
    if (pingQuery.match(message)) {
      // Respond on query.
      channel.respond(message, 'pong');
    }
  }
}, 3);
```
