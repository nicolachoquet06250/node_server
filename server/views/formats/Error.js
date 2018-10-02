"use strict";
let constants = require(require('../../constantsPath'));
let utils = require(constants.CoreUtilsPath + '/utils');
let view = require(constants.CoreMvcPath + '/view');
let Template = require(constants.ViewsFormatPath + '/Template');

module.exports = class Error extends view {
    after_construct() {
        this.object.setClass('Error');
        this.error_template = 'Error';
    }

    http_code_and_type_parameter() {
        this.response.writeHead(
            this.http_code, this._type === 'json' ?
                {'Content-Type': 'application/json'}
                : {'Content-Type': 'text/html'}
        );
    }

    request(request) {
        this._request = request;
    }

    type(type) {
        this._type = type;
        this.http_code_and_type_parameter();
    }

    html_error() {
        let template = new Template(this.response, this.http_code, false);
        template.Path(constants.ViewErrorPath + '/' + this.error_template);
        template._vars['http_code'] = this.http_code;
        template._vars['message'] = this._message;
        return template.display(this._request);
    }

    json_error() {
        return JSON.stringify({
                type: 'error',
                http_code: this.http_code,
                message: this._message
            });
    }

    display() {
        this.response.write(this._type === 'html' ? this.html_error() : this.json_error());
        utils.http_log(this._request, this.response, this._message);
    }
};