"use strict";
let constants = require(require('../../constantsPath'));
let model = require(constants.CoreMvcPath + '/model');

module.exports = class controller1 extends model {
    /** @method */
    method_json() {
        this.args.set('test', 'Je suis dans la méthode `method` du model `controller1` !');
        return this.args.get_all();
    }

    /** @method */
    method2_json() {
        this.args.set('test', 'Je suis dans la méthode `method2` du model `controller1` !');
        return this.args.get_all();
    }

    /** @method */
    method2_html() {
        this.args.set('test', 'Je suis dans la méthode `method2` du model `controller1` !');
        return this.args.get_all();
    }
};