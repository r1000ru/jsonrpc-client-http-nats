const NATS = require('nats'),
    errors = require('./jsonrpc-errors');

var JsonRPCClientNats = function(options, channel) {
    if (typeof(options) === 'object' && options.constructor.name === 'Client') {
        this._client = options;
        this._timeout = 1000;
    } else if (typeof(options) === 'string') {
        this._client = NATS.connect({ url: options });
        this._timeout = 1000;
    } else {
        this._client = NATS.connect(options);
        this._timeout = options.timeout || 1000;
    }

    this._channel = channel;
    
    this._client.on('error', (e)=>{
        let error = Object.assign({}, errors.INTERNAL_ERROR, {data: e.message})
        console.log(error);
    });
}

JsonRPCClientNats.prototype.request = function(method, params, timeout, callback) {
    if (typeof(params) === 'function' && !timeout && !callback) {
        callback = params;
        timeout = this._timeout;
        params = undefined;
    }

    if (typeof(timeout) === 'function' && !callback) {
        callback = timeout;
        timeout = this._timeout;
    }

    let req = {
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 1000),
        method: method,
        params: params
    }
    
    this._client.requestOne(this._channel, JSON.stringify(req), {}, timeout, (content)=>{
        if(content instanceof NATS.NatsError) {
            console.log(content);
            callback(errors.INTERNAL_ERROR);
            return;
        }
        
        try {
            content = JSON.parse(content);
        } catch (e) {
            console.log(e);
            callback(errors.PARSE_ERROR);
            return;
        }
    
        if (!content.jsonrpc || content.jsonrpc !== '2.0') {
            callback(errors.INVALID_REQUEST);
            return;
        }
    
        if (content.error) {
            callback(content.error);
            return;
        }
    
        callback(undefined, content.result);
    })
}

module.exports = JsonRPCClientNats;