# Клиент для запросов по протоколу JsonRPC через HTTP(s) и Nats


### Установка

```bash
npm install jsonrpc-client-http-nats --save
```

### Использование

```js
// Подключаем библиотеку
const JsonRPCClient = require('jsonrpc-client-http-nats');

// Создаем клиент для образения по HTTP(s)
let httpClient = JsonRPCClient.http('http://127.0.0.1:8080');

// И(или) создадаем клиент для обращения через Nats
let natsClient = JsonRPCClient.nats('nats://127.0.0.1:4222', 'MyChannel');

// Отправляем запрос через HTTP(s)
httpClient.request('FirstMethod', { title: 'MyTitle' }, (err, result)=>{
    console.log(err, result);
})

// Отправляем запрос через Nats
natsClient.request('SecondMethod', { title: 'MyData' }, (err, result)=>{
    console.log(err, result);
})
```

### API

#### Конструктор 

Конструктор `JsonRPCClientNats(options, channel [, timeout])` имеет три аргумента:
  - `options` - может быть:
    - объектом `options` для установки соединения с Nats согласно его [документации](https://github.com/nats-io/node-nats#connect-options);
    - URL для подключени, например: `nats://127.0.0.1:4222`;
    - результат выполнения `nats.connect()`, см. примечение ниже;
  - `channel` - канал, на котором сервер (например [JsonRPC-Server](https://github.com/r1000ru/jsonrpc-server))  слушает запросы от клиента;
  - `timeout` - время ожидания ответ на запрос в миллисекундах. Если не передан, то равняется 1000;
  
 Примечание: При создании каждого нового экземпляра клиента, если в качестве первого аргумента переданы параметры соединения или URL, создается новое подключение к серверу Nats. Если есть необходимость отправлять запросы на разные каналы одного сервера, имеет смысл в качестве `options` передать уже готовое подключение, чтобы все клиенты могли его использовать:
 
 ```js
const Nats = require('nats'),
    JsonRPCClientNats = require('jsonrpc-client-nats');

// Устанавливаем соединение с сервером Nats
const connection = Nats.connect({
    url: 'nats://127.0.0.1:4222'
});

// Создаем экземпляры клиентов, использующих одно подключение
let clientOne = new JsonRPCClientNats(connection, 'MyChannelOne');
let clientTwo = new JsonRPCClientNats(connection, 'MyChannelTwo');
 ```

#### Методы
`.request(method, [params [, timeout]], callback)` - отправляет запрос в канал и ожидает ответа. Аргументы метода:
  - `method` - метод JsonRPC, строка
  - `params` - параметры, не является обязательным и может быть любого типа
  - `timeout` - время ожидания ответа для запроса, если оно должно отличаться от времени заданном в конструкторе или по умолчанию. При использовании этого аргумента, указание аргумента `params` обязательно.
  - `callback` - функция, которая будет выполнена при получении ответа или ошибки. В функцию будут переданы два аргумента:
    - `error` - ошибка в стандарте JsonRPC, например `{ message: "Error message", code: 1}` или `undefined`, если запрос выполнен успешно;
    - `result` - результат выполнения метода или `undefined`, если присутствует ошибка.


