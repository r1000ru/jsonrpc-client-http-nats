const ClientNats = require('./jsonrpc-client-nats'),
    ClientHttp = require('./jsonrpc-client-http');

module.exports.nats = function(options, channel, timeout) {
    return new ClientNats(options, channel, timeout);
}

module.exports.http = function(url, timeout) {
    return new ClientHttp(url, timeout);
}