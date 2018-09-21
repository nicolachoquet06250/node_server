"use strict";
let constants = require(require('../../constantsPath'));
let object_base = require(constants.CoreUtilsPath + '/Object');

module.exports = class view {
    constructor(response, http_code) {
        this.response = response;
        this.http_code = http_code;
        this._message = [];
        this.object = new object_base('');
        this.http_code_and_type_parameter();
        this.after_construct();
    }

    after_construct() {}

    http_code_and_type_parameter() {}

    get_response() {
        return this.response;
    }

    message(message) {
        this._message = message;
    }

    display() {}
};