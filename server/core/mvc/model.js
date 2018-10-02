"use strict";
let constants = require(require('../../constantsPath'));
let object_base = require(constants.CoreUtilsPath + '/Object');

module.exports = class model {
    constructor(response, request, methode, args) {
        this.object = new object_base('');
        this.response = response;
        this.request = request;
        this.results = [];
        this.methode = methode;
        this.args = args;
        this.after_construct();
    }

    after_construct() {}

    execute(format) {
        this.results = eval('this.' + this.methode + '_' + format + '();');
        return this.results;
    }

    get_results() {
        return this.results;
    }
};