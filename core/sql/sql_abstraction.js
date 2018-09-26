"use strict";
let constants = require(require('../../constantsPath'));

module.exports = class sql_abstraction {
    constructor(conf) {
        let connector = require(constants.CoreSqlPath + '/formats/' + conf.format);
        this.connector = new connector(conf);

        this.ASC = 'asc';
        this.DESC = 'desc';

        this.EQUAL = this.connector.EQUAL === undefined ? '=' : this.connector.EQUAL;
        this.DIFFERENT = this.connector.DIFFERENT === undefined ? '!=' : this.connector.DIFFERENT;
        this.SUPPERIOR = this.connector.SUPPERIOR === undefined ? '>' : this.connector.SUPPERIOR;
        this.INFERIOR = this.connector.INFERIOR === undefined ? '<' : this.connector.INFERIOR;
        this.IOE = this.connector.IOE === undefined ? '<=' : this.connector.IOE;
        this.SOE = this.connector.SOE === undefined ? '>=' : this.connector.SOE;


        this.ADD = this.connector.ADD === undefined ? 'add' : this.connector.ADD;
        this.DROP = this.connector.DROP === undefined ? 'drop' : this.connector.DROP;
        this.MODIFY = this.connector.MODIFY === undefined ? 'modify' : this.connector.MODIFY;
        this.CHANGE = this.connector.CHANGE === undefined ? 'change' : this.connector.CHANGE;

    }

    select(request_obj) {
        return this.connector.select(request_obj);
    }
    insert(request_obj) {
        return this.connector.insert(request_obj);
    }
    update(request_obj) {
        return this.connector.update(request_obj);
    }
    delete(request_obj) {
        return this.connector.delete(request_obj);
    }
    create(request_obj) {
        return this.connector.create(request_obj);
    }
    drop(request_obj) {
        return this.connector.drop(request_obj);
    }
    alter(request_obj) {
        return this.connector.alter(request_obj);
    }
    show(request_obj) {
        return this.connector.show(request_obj);
    }

    query() {
        return this.connector.query();
    }
};