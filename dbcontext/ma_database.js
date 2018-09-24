"use strict";
let constants = require(require('../constantsPath'));
let dbcontext = require(constants.CoreSqlPath + '/dbcontext');

let db_name = 'ma_db';

let context = dbcontext.create('mon_context');
context.create_conf({
    format: 'json',
    name: 'alias1',
    path: constants.RootPath + '/databases',
    database: db_name
});

context.create_conf({
    format: 'mysql',
    name: 'alias1',
    server: 'mysql-nicolas-choquet.alwaysdata.net',
    user: 2405,
    password: '2669NICOLAS2107',
    database: 'test_db'
});

context.get_conf({
    format: 'json',
    name: 'alias1'
});

let db = context.append(db_name);

let table = db
    .set_table('ma_table')
    .set_field('id', 'number')
    .set_field('name', 'string')
    .set_field('birthday', 'date');

// console.log(context);
// console.log(db);
// console.log(table);

module.exports = context.genere();
