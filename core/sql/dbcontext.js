"use strict";
let constants = require(require('../../constantsPath'));
let conf = require(constants.CoreConfPath + '/conf');
let database = require(constants.CoreSqlPath + '/database');
let fs = require('fs');
let sql = require(constants.CoreSqlPath + '/sql_abstraction');

module.exports = class dbcontext {
    constructor(alias = '') {
        this.alias = alias;
        this.sql_conf = conf.get_sql();
        this.databases = {};
        this.result = true;
    }

    static create(alias = '', force_new = false) {
        if(!force_new) {
            if (dbcontext.instence === undefined) {
                dbcontext.instence = new dbcontext(alias);
            }
            return dbcontext.instence;
        }
        return new dbcontext(alias);
    }

    append(db) {
        if(this.databases === undefined) {
            this.databases = {};
        }
        this.databases[db] = new database(db);
        return this.databases[db];
    }

    get_db(db) {
        return this.databases[db];
    }

    static conf_exists(conf_o) {
        return conf.get_sql()[conf_o.format][conf_o.name] !== undefined;
    }

    create_conf(conf) {
        let format = conf.format;
        let name = conf.name;
        delete conf.format;
        delete conf.name;
        this.conf = {format: format, name: name};
        if(!dbcontext.conf_exists({format: format, name: name})) {
            this.sql_conf[format][name] = conf;
            fs.writeFileSync(constants.ConfsPath + '/sql_conf.json', JSON.stringify(this.sql_conf));
        }
        return this.sql_conf[format][name];
    }

    get_conf(conf) {
        let format = conf.format, name = conf.name;
        this.conf = {
            format: format,
            name: name
        };
        return this.sql_conf[format][name];
    }

    get_alias() {
        return this.alias;
    }

    genere() {
        let conf = this.conf;
        Object.keys(this.get_conf(this.conf)).forEach(key => {
            conf[key] = this.get_conf(this.conf)[key];
        });

        let connector = new sql(conf);

        Object.keys(this.databases).forEach(db => {
            let database = this.databases[db];
            connector.create('database', database.get_name()).query();
            Object.keys(database.tables).forEach(tbl => {
                let table = database.tables[tbl];
                connector.create('table', table.get_name(), table.get_fields()).query();
            });
        });

        return this.result;
    }
};