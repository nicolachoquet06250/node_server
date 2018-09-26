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

    /** @method */
    test_sql_abstraction_json() {
        let table = 'ma_table';

        let conf = require(constants.CoreConfPath + '/conf');
        let sql_conf = conf.get_sql();
        let sql_class = require(constants.CoreSqlPath + '/sql_abstraction');
        let conf_send = sql_conf['json']['alias1'];
        conf_send.format = 'json';
        conf_send.name = 'alias1';
        let sql = new sql_class(conf_send);

        let names = [
            'Nicolas',
            'Yann',
            'Michel',
            'Nolan',
            'Laurie'
        ];

        names.forEach(name => {
            let result = sql.select({
                table: table,
                where: [{
                    key: 'name',
                    operator: sql.EQUAL,
                    value: name
                }]
            }).query();
            let nb = result.length;
            if(nb === 0) {
                sql.insert({
                    table: table,
                    values: {
                        name: name,
                        birthday: new Date().toDateString()
                    }
                }).query();
            }
        });

        let select = sql.select({
            table: table,
            fields: {
                id: 'id',
                name: 'nom'
            },
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        sql.update({
            table: table,
            values: {
                name: '_Yann'
            },
            where: [{
                key: 'name',
                operator: sql.EQUAL,
                value: 'Nicolas'
            }]
        }).query();

        let select_after_update = sql.select({
            table: table,
            fields: {
                id: 'id',
                name: 'nom'
            },
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        sql.delete({
            table: table,
            where: [{
                key: 'name',
                operator: sql.EQUAL,
                value: '_Yann'
            }]
        }).query();

        let select_after_delete = sql.select({
            table: table,
            fields: {
                id: 'id',
                name: 'nom'
            },
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        let show_fields = sql.show({
            mode: 'fields',
            table: table
        }).query();

        let show_tables = sql.show({
            mode: 'tables'
        }).query();

        let show_databases = sql.show({
            mode: 'databases'
        }).query();

        sql.alter({
            table: table,
            mode: sql.ADD,
            fields: {
                age: {
                    type: 'number'
                }
            }
        }).query();

        let select_after_alter_add = sql.select({
            table: table,
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        sql.alter({
            table: table,
            mode: sql.DROP,
            fields: [
                'age'
            ]
        }).query();

        let select_after_alter_drop = sql.select({
            table: table,
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        sql.alter({
            table: table,
            mode: sql.CHANGE,
            fields: [{
                old: 'birthday',
                new: {
                    name: 'anniversaire',
                    type: 'string'
                }
            }]
        }).query();

        let select_after_alter_change = sql.select({
            table: table,
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        sql.alter({
            table: table,
            mode: sql.MODIFY,
            fields: {
                anniversaire: {
                    type: 'string'
                }
            }
        }).query();

        let select_after_alter_modify = sql.select({
            table: table,
            where: [{
                key: 'id',
                operator: sql.SOE,
                value: 0
            }],
            ordered: 'id',
            direction: sql.ASC
        }).query();

        sql.drop({
            mode: 'table',
            table: table
        }).query();

        sql.drop({
            mode: 'database'
        }).query();

        return {
            select: {
                select: select,
                select_after_update: select_after_update,
                select_after_delete: select_after_delete,
                select_after_alter_add: select_after_alter_add,
                select_after_alter_drop: select_after_alter_drop,
                select_after_alter_change: select_after_alter_change,
                select_after_alter_modify: select_after_alter_modify
            },
            show: {
                databases: show_databases,
                tables: show_tables,
                fields: show_fields
            }
        }
    }
};