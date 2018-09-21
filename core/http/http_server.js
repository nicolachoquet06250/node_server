"use strict";
let constants = require(require('../../constantsPath'));
let http = require('http');
let utils = require(constants.CoreUtilsPath + '/utils');

class http_server {
    createServer(callback, port) {
        http.createServer((req, resp) => {
            callback(req, resp, utils.http_log);
        }).listen(port);
    }
}

module.exports = http_server;