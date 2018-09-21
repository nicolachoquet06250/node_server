"use strict";
let constants = require(require('../../constantsPath'));
let ctrl = require(constants.CoreMvcPath + '/controller');
let Error = require(constants.ViewsFormatPath + '/Error');
let utils = require(constants.CoreUtilsPath + '/utils');

module.exports = class controller1 extends ctrl {
    view(format) {
        let view = require(constants.ViewsFormatPath + '/' + utils.ucfirst(format));
        let error = false;
        let view_obj = new view(this.response, 200);

        if(error) {
            let Error_obj = new Error(this.response, 500);
            Error_obj.request(this.request);
            Error_obj.message('Erreur de serveur');
            return Error_obj;
        }
        let obj_for_vars = {
            mon_message: 'voila le text du template'
        };

        this.get_results_size();

        if(this.get_results_size() > 0) {
            Object.keys(this.model_result).forEach((key) => {
                obj_for_vars[key] = this.model_result[key];
            });
        }
        obj_for_vars['host'] = constants.Host + ':' + constants.ServerPort;

        if(format !== 'json') {
            view_obj.Template(
                constants.ViewsLayoutsPath + '/mon_layout',
                obj_for_vars
            );
        }
        else  {
            view_obj.message(obj_for_vars);
        }
        return view_obj;
    }
};