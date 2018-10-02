"use strict";

module.exports = class args {
    constructor(args) {
        this.set_all(args);
    }

    get(key) {
        return this._args[key] !== undefined ? this._args[key] : null;
    }

    set(key, value) {
        this._args[key] = value;
    }

    get_all() {
        return this._args;
    }

    set_all(args) {
        this._args = args;
    }
};
