"use strict";
let constants = require(require('../../constantsPath'));
let utils = require(constants.CoreUtilsPath + '/utils');
let object_base = require(constants.CoreUtilsPath + '/Object');
let fs = require('fs');
let args_class = require(constants.CoreParsersPath + '/args');

module.exports = class controller {
    constructor(request, response) {
        this.response = response;
        this.request = request;
        this.object = new object_base('');
        this.args = [];
        this.model_result = [];
        this.after_construct();
    }

    after_construct() {}

    static method_is_in(method_name, methods, ext) {
        for(let i=0, max=methods.length; i<max; i++) {
            if(methods[i] === method_name + '_' + ext) {
                return true;
            }
        }
        return false;
    }

    model(method, args, fields, files, ext) {
        if(this.args[0] !== undefined) this.args = utils.format_args(args);
        if(fs.existsSync(constants.MvcModelsPath + '/' + this.object.getClass() + constants.filesExtensions['js'])) {
            let model = require(constants.MvcModelsPath + '/' + this.object.getClass());

            let args_obj = new args_class(args);
            if(this.request.method !== 'GET') {
                args_obj.set(this.request.method, fields);
            }
            if(files.length > 0) {
                args_obj.set('files', files);
            }
            this.args = args_obj;
            let model_obj = new model(this.response, this.request, method, args_obj);
            let methods = utils.get_object_methods(constants.MvcModelsPath + '/' + this.object.getClass());

            if(controller.method_is_in(method, methods, ext)) {
                model_obj.object.setClass(this.object.getClass());
                if (model_obj.object.getClass() === this.object.getClass()) {
                    this.model_result = model_obj.execute(ext);
                }
            }
            else {
                let Error = require(constants.ViewsFormatPath + '/Error');
                let Error_obj = new Error(this.response, 404);
                Error_obj.request(this.request);
                Error_obj.type(ext);
                Error_obj.message(constants.MethodNotFoundMessage(this.object.getClass(), method, ext));
                return Error_obj;
            }
        }
    }

    view(format) {}

    get_results_size() {
        let nb = 0;
        if(typeof this.model_result === 'object') {
            nb = Object.keys(this.model_result).length;
        }
        else {
            nb = this.model_result.length;
        }
        return nb;
    }
};