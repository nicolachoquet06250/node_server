"use strict";
let constants = require(require('../../constantsPath'));

module.exports = class sql_abstraction {
    constructor(conf) {
        let connector = require(constants.CoreSqlPath + '/formats/' + conf.format);
        this.connector = new connector();
        this.connector.set_conf(conf);
    }

    select() {
        return this.connector.select();
    }
    insert() {
        return this.connector.insert();
    }
    update() {
        return this.connector.update();
    }
    delete() {
        return this.connector.delete();
    }
    create() {
        return this.connector.create();
    }
    drop() {
        return this.connector.drop();
    }
    alter() {
        return this.connector.alter();
    }

    query() {
        return this.connector.query();
    }
};