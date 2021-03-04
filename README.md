# Command query channels.
[![codecov](https://codecov.io/gh/OliMe/cq-ch/branch/master/graph/badge.svg?token=EAESO7AKNO)](https://codecov.io/gh/OliMe/cq-ch)

## Motivation

В некоторых случаях JS-приложениям в браузере необходимо обмениваться информацией или выполнять какие-либо действия в ответ на события в другом приложении, которое исполняется с ним в одном окружении.

Особенно это актуально для микросервисной архитектуры, которая реализуется в приложении исполняющемся в браузере.

Конечно всегда можно использовать события. Но это легко может привести к загрязнению кода, усилению зацепления между приложениями и расплывчатым интерфейсам.

## Usage

### Отправка команд.

Объявляем интерфейс команд, которые будет отправлять приложение.
Получаем функцию для отправки данных.
```javascript
import command from '@olime/cq-ch/command';
// Создаём интерфейс команд которые будет отправлять приложение.
const send = command(['FIRST_COMMAD_TYPE', 'SECOND_COMMAND_TYPE'], 'unique-key-of-application');
// Отправляем данные. Для этого отправляем команду - это простой JS-объект с одним обязательным полем type.
send({
  type: 'FIRST_COMMAND_TYPE',
  data: 'Hello world.'
});
```

### Получение команд.

Объявляем интерфейс команд, которые будет выполнять приложение.
Получаем функцию, для запроса следующей команды из очереди полученных сообщений.
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

### Отправка запросов.

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
