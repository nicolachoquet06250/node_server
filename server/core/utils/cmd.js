"use strict";
let constants = require(require('../../constantsPath'));
let base = require(constants.CoreUtilsPath + '/Object');

module.exports = class command {
    constructor(argv) {
        this.argv = argv;
        this.object = new base('');
        this.after_construct();
    }

    after_construct() {}

    get(key) {
        return this.argv[key] !== undefined ? this.argv[key] : null;
    }

    execute(method) {
        if(eval('this.' + method) !== undefined) {
            eval('this.' + method + '()');
        }
        else {
            console.log(`ERROR: La méthode \`${method}\` de la commande \`${this.object.getClass()}\``);
        }
    }
};