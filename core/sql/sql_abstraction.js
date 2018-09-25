"use strict";
let constants = require(require('../../constantsPath'));

module.exports = class sql_abstraction {
    constructor(conf) {
        let connector = require(constants.CoreSqlPath + '/formats/' + conf.format);
        this.connector = new connector(conf);

        sql_abstraction.ASC = 'asc';
        sql_abstraction.DESC = 'desc';

        sql_abstraction.EQUAL = '=';
        sql_abstraction.DIFFERENT = '!=';
        sql_abstraction.SUPPERIOR = '>';
        sql_abstraction.INFERIOR = '<';
        sql_abstraction.IOE = '<=';
        sql_abstraction.SOE = '>=';
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