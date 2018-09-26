"use strict";
let fs = require('fs');
let constants = require(require('../../../constantsPath'));
let utils = require(constants.CoreUtilsPath + '/utils');
let sql = require(constants.CoreSqlPath + '/sql_abstraction');

module.exports = class json {
    constructor(conf) {
        this.set_conf(conf);
        this.modes = {'r': 'read', 'w': 'write'};
        this.request_obj = {};
        this.key = '';

        this.EQUAL = '===';
        this.DIFFERENT = '!==';
    }

    set_conf(conf) {
        this.conf = conf;
        return this;
    }

    select(request_obj) {
        this.key = 'select';
        this.mode = this.modes['r'];
        this.request_obj = request_obj;
        return this;
    }
    insert(request_obj) {
        this.key = 'insert';
        this.mode = this.modes['w'];
        this.request_obj = request_obj;
        return this;
    }
    update(request_obj) {
        this.key = 'update';
        this.mode = this.modes['w'];
        this.request_obj = request_obj;
        return this;
    }
    delete(request_obj) {
        this.key = 'delete';
        this.mode = this.modes['w'];
        this.request_obj = request_obj;
        return this;
    }
    create(request_obj) {
        this.key = 'create';
        this.mode = this.modes['w'];
        this.request_obj = request_obj;
        return this;
    }
    drop(request_obj) {
        this.key = 'drop';
        this.mode = this.modes['w'];
        this.request_obj = request_obj;
        return this;
    }
    alter(request_obj) {
        this.key = 'alter';
        this.mode = this.modes['w'];
        this.request_obj = request_obj;
        return this;
    }
    show(request_obj) {
        this.key = 'show';
        this.mode = this.modes['r'];
        this.request_obj = request_obj;
        return this;
    }

    query() {
        let name;
        let table;
        let db_name;
        switch (this.mode) {
            case this.modes['r']:
                switch (this.key) {
                    case 'select':
                        db_name = this.request_obj.database !== undefined ? this.request_obj.database : this.conf.database;
                        name = this.request_obj.table;
                        if(fs.existsSync(this.conf.path + '/' + db_name)) {
                            if (fs.existsSync(this.conf.path + '/' + db_name + '/' + name + '.json')) {
                                let table_content = JSON.parse(fs.readFileSync(this.conf.path + '/' + db_name + '/' + name + '.json'));
                                let header = table_content.header;
                                let body = [];
                                let fields;
                                if(this.request_obj.fields !== undefined) {
                                    fields = this.request_obj.fields;
                                }
                                else {
                                    fields = Object.keys(header);
                                }
                                let _fields = {};
                                if(Array.isArray(fields)) {
                                        fields.forEach(key => {
                                            let alias = key;
                                            let field_is_ok = false;
                                            Object.keys(header).forEach(_key => {
                                                if(_key === key) {
                                                    field_is_ok = true;
                                                }
                                            });
                                            if(field_is_ok) {
                                                _fields[key] = alias;
                                            }
                                            else {
                                                console.log('ERROR: field  ' + key + ' is missing !');
                                            }
                                        });
                                    }
                                else {
                                        Object.keys(fields).forEach(key => {
                                            let alias = fields[key];
                                            let field_is_ok = false;
                                            Object.keys(header).forEach(_key => {
                                                if(_key === key) {
                                                    field_is_ok = true;
                                                }
                                            });
                                            if(field_is_ok) {
                                                _fields[key] = alias;
                                            }
                                            else {
                                                console.log('ERROR: field  ' + key + ' is missing !');
                                            }
                                        });
                                    }
                                table_content.body.forEach(obj => {
                                    let line = {};
                                    Object.keys(_fields).forEach(key => {
                                        let alias = _fields[key];
                                        let cmp = 0;
                                        Object.keys(header).forEach((_key, id) => {
                                            if(key === _key) {
                                                line[alias] = obj[id];
                                            }
                                            cmp++;
                                        });
                                    });
                                    if(this.request_obj.where === undefined) {
                                        body[body.length] = line;
                                    }
                                    else {
                                        let value_is_valid = true;
                                        this.request_obj.where.forEach(obj => {
                                            if(!eval('line[\'' + obj.key + '\']' + ' ' + obj.operator + ' ' + obj.value)) {
                                                value_is_valid = false;
                                            }
                                        });
                                        if(value_is_valid) {
                                            body[body.length] = line;
                                        }
                                    }
                                });
                                if(this.request_obj.ordered !== undefined && this.request_obj.direction !== undefined) {
                                    body.sort((array1, array2) => {
                                        if(this.request_obj.direction === sql.ASC) {
                                            return array1[this.request_obj.ordered] - array2[this.request_obj.ordered];
                                        }
                                        else {
                                            return array1[this.request_obj.ordered] + array2[this.request_obj.ordered];
                                        }
                                    });
                                }
                                return body;
                            }
                            else {
                                console.log('ERROR: table \`'+ name +'\` not found in database \`' + db_name + '\` !');
                            }
                        }
                        else {
                            console.log('ERROR: database \`' + db_name + '\` not found !');
                        }
                        return [];
                    case 'show':
                        let conf = this.conf;
                        let results = {};
                        switch (this.request_obj.mode) {
                            case 'databases':
                                if(fs.existsSync(conf.path)) {
                                    results = fs.readdirSync(conf.path);
                                }
                                else console.log('ERROR: server \`' + conf.name + '\` not found !');
                                break;
                            case 'tables':
                                db_name = this.request_obj.database !== undefined ? this.request_obj.database : conf.database;
                                if(fs.existsSync(conf.path)) {
                                    if(fs.existsSync(conf.path + '/' + db_name)) {
                                        results = fs.readdirSync(conf.path + '/' + db_name);
                                    }
                                    else console.log('ERROR: database \`' + db_name + '\` not found in server \`' + conf.name + '\` !');
                                }
                                else console.log('ERROR: server \`' + conf.name + '\` not found !');
                                break;
                            case 'fields':
                                if(this.request_obj.table !== undefined) {
                                    let table = this.request_obj.table;
                                    if (fs.existsSync(conf.path)) {
                                        if (fs.existsSync(conf.path + '/' + conf.database)) {
                                            if (fs.existsSync(conf.path + '/' + conf.database + '/' + table + '.json')) {
                                                results = Object.keys(JSON.parse(fs.readFileSync(conf.path + '/' + conf.database + '/' + table + '.json').toString()).header);
                                            }
                                            else console.log('ERROR: table \`' + table + '\` not found in database \`' + conf.name + '.' + conf.database + '\` !');
                                        }
                                        else console.log('ERROR: database \`' + conf.database + '\` not found in server \`' + conf.name + '\` !');
                                    }
                                    else console.log('ERROR: server \`' + conf.name + '\` not found !');
                                }
                                else console.log('ERROR: determine in which table you want to recover the fields !');
                                break;
                        }
                        return results;
                }
                break;
            case this.modes['w']:
                switch (this.key) {
                    case 'insert':
                        db_name = this.request_obj.database !== undefined ? this.request_obj.database : this.conf.database;
                        name = this.request_obj.table;
                        if(fs.existsSync(this.conf.path + '/' + db_name)) {
                            if(fs.existsSync(this.conf.path + '/' + db_name + '/' + name + '.json')) {
                                let values = [];
                                let table_content = JSON.parse(fs.readFileSync(this.conf.path + '/' + db_name + '/' + name + '.json'));
                                let cmp = 0;
                                let header = table_content.header;

                                Object.keys(header).forEach(key => {
                                    let obj = header[key];
                                    let value;
                                    if(obj.autoincrement && obj.type === 'number' && this.request_obj.values[key] === undefined) {
                                        if(table_content.body.length === 0) {
                                            value = 0;
                                        }
                                        else {
                                            value = table_content.body[table_content.body.length-1][cmp];
                                            value = value+1;
                                        }
                                    }
                                    else if (obj.autoincrement && obj.type === 'number' && this.request_obj.values[key] !== undefined) {
                                        let id_exists = false;
                                        table_content.body.forEach(obj => {
                                            if(obj[cmp] === this.request_obj.values[key]) {
                                                id_exists = true;
                                            }
                                        });
                                        if(id_exists) {
                                            console.log('ERROR: field \`' + key + '\` must be unique')
                                        }
                                        else {
                                            value = this.request_obj.values[key];
                                        }
                                    }
                                    else {
                                        if(obj.default !== undefined && this.request_obj.values[key] === undefined) {
                                            value = obj.default;
                                        }
                                        else if (obj.default === undefined && this.request_obj.values[key] !== undefined) {
                                            value = this.request_obj.values[key]
                                        }
                                        else if (obj.default === undefined && this.request_obj.values[key] === undefined) {
                                            console.log('ERROR: expected field \`' + key + '\`')
                                        }
                                    }
                                    values[values.length] = value;
                                    cmp++;
                                });
                                let body = table_content.body;
                                body[body.length] = values;
                                table_content.body = body;
                                fs.writeFileSync(this.conf.path + '/' + db_name + '/' + name + '.json', JSON.stringify(table_content));
                            }
                            else console.log('ERROR: table \`'+ name +'\` not found in database \`' + db_name + '\` !');
                        }
                        else console.log('ERROR: database \`' + db_name + '\` not found !');
                        break;
                    case 'update':
                        db_name = this.request_obj.database !== undefined ? this.request_obj.database : this.conf.database;
                        table = this.request_obj.table;
                        if(fs.existsSync(this.conf.path + '/' + db_name)) {
                            if(table !== undefined) {
                                if (fs.existsSync(this.conf.path + '/' + db_name + '/' + table + '.json')) {
                                    let values = this.request_obj.values;
                                    let where = this.request_obj.where;
                                    let table_content = JSON.parse(fs.readFileSync(this.conf.path + '/' + db_name + '/' + table + '.json'));
                                    let header = table_content.header;
                                    let body = this.select({table: table}).query();

                                    let fields_to_update = {};
                                    Object.keys(values).forEach(key => {
                                        if(utils.in(key, Object.keys(header))) {
                                            fields_to_update[key] = values[key];
                                        }
                                    });

                                    body.forEach((line, id) => {
                                        Object.keys(fields_to_update).forEach(field => {
                                            let where_condition_is_valid = true;
                                            if(where !== undefined) {
                                                where.forEach(obj => {
                                                    if(!eval('line[\'' + obj.key + '\'] ' + obj.operator + ' ' + (typeof obj.value === 'string' ? '"' + obj.value + '"' : obj.value))) {
                                                        where_condition_is_valid = false;
                                                    }
                                                });
                                            }
                                            if(where_condition_is_valid) {
                                                Object.keys(fields_to_update).forEach(key => {
                                                    line[key] = fields_to_update[key];
                                                });

                                                let line_values = [];
                                                Object.keys(line).forEach(key => {
                                                    line_values[line_values.length] = line[key];
                                                });

                                                table_content.body[id] = line_values;
                                            }
                                        });
                                    });
                                    fs.writeFileSync(this.conf.path + '/' + db_name + '/' + table + '.json', JSON.stringify(table_content));
                                }
                                else console.log('ERROR: table \`' + table + '\` not found in database \`' + db_name + '\` !');
                            }
                            else console.log('ERROR: table name is expected !')
                        }
                        else console.log('ERROR: database \`' + db_name + '\` not found !');
                        break;
                    case 'delete':
                        db_name = this.request_obj.database !== undefined ? this.request_obj.database : this.conf.database;
                        table = this.request_obj.table;
                        if(fs.existsSync(this.conf.path + '/' + db_name)) {
                            if (table !== undefined) {
                                if (fs.existsSync(this.conf.path + '/' + db_name + '/' + table + '.json')) {
                                    let where = this.request_obj.where;
                                    let table_content = JSON.parse(fs.readFileSync(this.conf.path + '/' + db_name + '/' + table + '.json'));
                                    let body = this.select({table: table}).query();

                                    body.forEach((line, id) => {
                                        let where_condition_is_valid = true;
                                        if(where !== undefined) {
                                            where.forEach(obj => {
                                                if(!eval('line[\'' + obj.key + '\'] ' + obj.operator + ' ' + (typeof obj.value === 'string' ? '"' + obj.value + '"' : obj.value))) {
                                                    where_condition_is_valid = false;
                                                }
                                            });
                                        }
                                        if(where_condition_is_valid) {
                                            delete table_content.body[id];
                                        }
                                    });
                                    let _table_content_body = [];
                                    table_content.body.forEach(obj => {
                                        if(obj !== undefined && obj !== null !== '') {
                                            _table_content_body[_table_content_body.length] = obj;
                                        }
                                    });
                                    table_content.body = _table_content_body;
                                    fs.writeFileSync(this.conf.path + '/' + db_name + '/' + table + '.json', JSON.stringify(table_content));
                                }
                                else console.log('ERROR: table \`' + table + '\` not found in database \`' + db_name + '\` !');
                            }
                            else console.log('ERROR: table name is expected !')
                        }
                        else console.log('ERROR: database \`' + db_name + '\` not found !');
                        break;
                    case 'create':
                        let mode = this.request_obj.mode;
                        name = this.request_obj[mode] !== undefined ? this.request_obj[mode] : this.conf.database;
                        db_name = this.request_obj.database !== undefined ? this.request_obj.database : this.conf.database;
                        let fields = null;

                        if(mode === 'database') {
                            if(!fs.existsSync(this.conf.path + '/' + name)) {
                                if(!fs.existsSync(this.conf.path)) {
                                    fs.mkdirSync(this.conf.path);
                                }
                                fs.mkdirSync(this.conf.path + '/' + name);
                            }
                        }
                        else if (mode === 'table') {
                            fields = this.request_obj.fields;
                            if(fs.existsSync(this.conf.path + '/' + db_name)) {
                                if(!fs.existsSync(this.conf.path + '/' + db_name + '/' + name + '.json')) {
                                    fs.writeFileSync(this.conf.path + '/' + db_name + '/' + name + '.json', JSON.stringify({
                                        header: fields,
                                        body: []
                                    }));
                                }
                                else {
                                    console.log('WARNING: table \`'+ name +'\` already exists in database \`' + db_name + '\` !');
                                }
                            }
                            else {
                                console.log('ERROR: database \`' + db_name + '\` not found !');
                            }
                        }
                        return fs.existsSync(this.conf.path + '/' + db_name + '/' + name + '.json');
                    case 'drop':
                    case 'alter':
                        break;
                }
                break;
        }
        return this;
    }
};