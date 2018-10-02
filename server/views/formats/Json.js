"use strict";
let constants = require(require('../../constantsPath'));
let view = require(constants.CoreMvcPath + '/view');

module.exports = class Json extends view {
    after_construct() {
        this.object.setClass('Json');
    }

    http_code_and_type_parameter() {
        this.response.writeHead(this.http_code, {'Content-Type': 'application/json'});
    }

    display() {
        if(typeof this._message === 'object') {
            this.response.write(JSON.stringify(this._message));
        }
        else if(typeof this._message === 'string') {
            this.response.write(this._message);
        }
    }
};