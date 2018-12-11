const JsonRPCClientNats = require('../src/jsonrpc-client-nats');
    
let client = new JsonRPCClientNats('nats://192.168.100.10:4222', 'TestChannel');

// Запрос без параметров
client.request('Ping', (err, result) => {
    console.log('On Ping Error:', err);
    console.log('On Ping Result:', result);
    console.log("\n");
});

// Запрос с параметром
client.request('Hello', 'Roman', (err, result) => {
    console.log('On Hello Error:', err);
    console.log('On Hello Result:', result);
    console.log("\n");
});

// Запрос с параметром и таймаутом
client.request('MethodNotExist', {
    title: 'Roman'
}, 2000, (err, result) => {
    console.log('On MethodNotExist Error:', err);
    console.log('On MethodNotExist Result:', result);
    console.log("\n");
});

