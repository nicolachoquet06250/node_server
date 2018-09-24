"use strict";
let constants = require(require('../../constantsPath'));
let table = require(constants.CoreSqlPath + '/table');

module.exports = class database {
    constructor(name) {
        this.database_name = name;
        this.tables = {};
    }

    set_table(table_n) {
        this.tables[table_n] = new table(table_n);
        return this.tables[table_n];
    }

    get_name() {
        return this.database_name;
    }

    get_table(table) {
        return this.tables[table] !== undefined ? this.tables[table] : null;
    }
};