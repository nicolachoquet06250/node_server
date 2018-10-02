"use strict";

module.exports = class Object {
    constructor(classe = '') {
        this.setClass(classe);
    }
    setClass(classe) {
        this.class = classe;
    }
    getClass() {
        return this.class;
    }
};