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
        // sql.insert({
        //     table: table,
        //     values: {
        //         name: 'Nicolas',
        //         birthday: new Date().toDateString()
        //     }
        // }).query();

        return sql.select({
            table: table,
            fields: {
                id: 'id',
                name: 'nom'
            },
            where: [{
                key: 'id',
                value: 0,
                operator: sql_class.SOE
            }],
            ordered: 'id',
            direction: sql_class.ASC
        }).query();
    }
};