const URL = require('url'),
    http = require('http'),
    https = require('https'),
    errors = require('./jsonrpc-errors');

var JsonRPCClientHTTP = function(url, timeout) {
    let conn = URL.parse(url);
    this._timeout = timeout || 1000;
    this._port = conn.port || (conn.protocol === 'https:' ? 443 : 80);
    this._host = conn.hostname;
    this._path = conn.pathname;

    this._protocol = conn.protocol === 'https:' ? https : http;

}

JsonRPCClientHTTP.prototype.request = function(method, params, timeout, callback) {
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

    this._httpRequest(req, timeout, callback);
}

JsonRPCClientHTTP.prototype._httpRequest = function(json, timeout, callback) {
    
    let bodyString = Buffer.from(JSON.stringify(json), 'utf8');

    let options = {
        host: this._host,
        path: this._path,
        port: this._port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': bodyString.byteLength
        }
    }

    var timer;

    const req = this._protocol.request(options, (res) => {
        var response = '';

        res.on('data', (chank) => {
            response += chank;
        });

        res.on('end', () => {
            clearTimeout(timer);
            this._onResponse(response, callback);
        });
    });

    var timer = setTimeout(()=>{
        req.abort();
        console.log('Timeout', bodyString.toString())
        callback(errors.INTERNAL_ERROR);
    }, timeout);

    req.on('error', (e) => {
        console.log(e);
        callback(errors.INTERNAL_ERROR);
    });
    
    req.write(bodyString);
}

JsonRPCClientHTTP.prototype._onResponse = function(content, callback) {
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
}

module.exports = JsonRPCClientHTTP;