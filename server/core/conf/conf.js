"use strict";
let constants = require(require('../../constantsPath'));
let fs = require('fs');

class conf {
    constructor() {
        this.formats = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/formats.json`)).toString());
        this.js_authorizations = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/js_authorizations.json`)).toString());
        this.scss_authorizations = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/scss_authorizations.json`)).toString());
        this.router = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/router.json`)).toString());
        this.sql = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/sql_conf.json`)).toString());
        this.static_dirs = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/static_dirs.json`)).toString());
        this.access_rights = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/access_rights.json`)).toString());
        this.files_extensions = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/files_extensions.json`)).toString());
        this.http_methods = JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/http_methods.json`)).toString());
    }

    get_formats() {
        return this.formats;
    }

    get_authorizations(type) {
        return eval(`this.${type}_authorizations`);
    }

    get_sql() {
        return this.sql;
    }

    get_router() {
        return this.router;
    }

    get_statics_dirs() {
        return this.static_dirs;
    }

    get_access_rights() {
        return this.access_rights;
    }

    get_access_right(right_name) {
        return this.access_rights[right_name] !== undefined ? this.access_rights[right_name] : null;
    }

    get_files_extensions() {
        return this.files_extensions;
    }

    get_http_methods() {
        return this.http_methods;
    }

    get_server_port_generated() {
      if (fs.existsSync(fs.realpathSync(`${__dirname}/../../conf/server_infos.json`))) {
        return JSON.parse(fs.readFileSync(fs.realpathSync(`${__dirname}/../../conf/server_infos.json`)));
      }
      else {
          return constants.ServerPort;
      }
    }
}

module.exports = new conf();