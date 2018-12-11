const JsonRPCClient = require('../src/jsonrpc-client');
    
let natClient = JsonRPCClient.nats('nats://127.0.0.1:4222', 'TestChannel');
let httpClient = JsonRPCClient.http('http://127.0.0.1:8080');

// Запрос без параметров
natClient.request('Ping', (err, result) => {
    console.log('On other Nats Ping Error:', err);
    console.log('On other Nats Ping Result:', result);
    console.log("\n");
});

// Запрос с параметром
natClient.request('Hello', 'Roman', (err, result) => {
    console.log('On other Nats Hello Error:', err);
    console.log('On other Nats Hello Result:', result);
    console.log("\n");
});

// Запрос с параметром и таймаутом
natClient.request('MethodNotExist', {
    title: 'Roman'
}, 2000, (err, result) => {
    console.log('On other Nats MethodNotExist Error:', err);
    console.log('On other Nats MethodNotExist Result:', result);
    console.log("\n");
});

// Запрос без параметров
httpClient.request('Ping', (err, result) => {
    console.log('On other HTTP Ping Error:', err);
    console.log('On other HTTP Ping Result:', result);
    console.log("\n");
});

// Запрос с параметром
httpClient.request('Hello', 'Roman', (err, result) => {
    console.log('On Hello other HTTP Error:', err);
    console.log('On Hello other HTTP Result:', result);
    console.log("\n");
});

// Запрос с параметром и таймаутом
httpClient.request('MethodNotExist', {
    title: 'Roman'
}, 2000, (err, result) => {
    console.log('On other HTTP MethodNotExist Error:', err);
    console.log('On other HTTP MethodNotExist Result:', result);
    console.log("\n");
});
