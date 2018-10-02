"use strict";
let constants = require(require('../../constantsPath'));
let view = require(constants.CoreMvcPath + '/view');
let Template = require(constants.ViewsFormatPath + '/Template');

module.exports = class Html extends view {
    after_construct() {
        this._message = '';
        this._template = null;
        this.object.setClass('Html');
    }

    template(path, ...vars) {
        this.Template(path, vars);
    }

    Template(path, vars = []) {
        this._template = new Template(this.response, this.http_code);
        this._template.Path(path);
        this._template.Vars(vars);
    }

    http_code_and_type_parameter() {
        this.response.writeHead(this.http_code, {'Content-Type': 'text/html'});
    }

    display(request) {
        this._message = '';
        if(this._template) {
            this._template.display(request);
        }
        else {
            this.response.write(this._message);
        }

    }
};