"use strict";
let constants = require(require('../../constantsPath'));
let view = require(constants.CoreMvcPath + '/view');
let fs = require('fs');
let utils = require(constants.CoreUtilsPath + '/utils');

module.exports = class Template extends view {
    constructor(response, http_code, show = true) {
        super(response, http_code);
        this.show = show;
        this._message = '';
    }

    after_construct() {
        this._vars = [];
        this._path = '';
        this.object.setClass('Template');
    }

    http_code_and_type_parameter() {
        if(this.show === true) {
            this.response.writeHead(this.http_code, {'Content-Type': 'text/html'});
        }
    }

    Path(path) {
        this._path = path + '.html';
    }

    Vars(vars) {
        this._vars = vars;
    }

    append(_var, _value) {
        this._vars[_var] = _value;
    }

    display(request) {
        if(this._path && fs.existsSync(this._path)) {
            this._message = fs.readFileSync(this._path);
            this._message = utils.Print(this._message, this._vars);

            let regex = /\[([a-zA-Z0-9\_\-\.]+)\]/g;
            let m;
            while ((m = regex.exec(this._message)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) regex.lastIndex++;

                let sub_template = m[1];
                let template = new Template(this.response, this.http_code, false);
                template.Path(constants.ViewsLayoutsPath+ '/' + sub_template.replace(/\./g, '/'));
                template.Vars(this._vars);
                this._message = this._message.replace(m[0], template.display(request));
            }
        }
        else {
            if(this.show) {
                let Error = require(constants.ViewsFormatPath + '/Error');
                let Error_obj = new Error(this.response, 404);
                Error_obj.message('La page demandée n\'existe pas !');
                Error_obj.type('html');
                Error_obj.request(request);
                Error_obj.display();
            }
        }

        if(this.show === true) {
            this.response.write(this._message);
        }
        else {
            return this._message;
        }
    }
};