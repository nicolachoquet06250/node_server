"use strict";
let constants = require(require('../../constantsPath'));
let fs = require('fs');
let cli_color = require("cli-color");

module.exports = class utils {
    static http_log(req, resp, message = null) {
        message = message !== null ? '- ' + message : '';
        let date = constants.TodayDate + ' - ' + (new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()) + ':' + (new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds());
        let url = req.url;
        let host = req.headers.host;
        let statusCode = resp.statusCode;
        let statusCode_s = '';
        let message_s = message;
        switch (statusCode) {
            case 404:
            case 400:
                if(message !== null) {
                    message_s = utils.warning_color(message_s);
                }
                statusCode_s = utils.error_color(statusCode);
                break;
            case 500:
                if(message !== null) {
                    message_s = utils.error_color(message_s);
                }
                statusCode_s = utils.error_color(statusCode);
                break;
            case 200:
            default:
                if(message !== null) {
                    message_s = utils.success_color(message_s);
                }
                statusCode_s = utils.success_color(statusCode);
                break;
        }
        let obj_to_write_in_file = {date: date, host: host, statusCode: statusCode, url: url, message: message};
        let obj_to_write_in_console = {date: date, host: host, statusCode: statusCode_s, url: url, message: message_s};

        if(!fs.existsSync(constants.LogsPath)) {
            fs.mkdir(constants.LogsPath);
        }

        if(!fs.existsSync(constants.LogsPath + '/' + constants.LogFileName + constants.LogExtension)) {
            fs.writeFile(constants.LogsPath + '/' + constants.LogFileName + constants.LogExtension, utils.Print(constants.LogSyntax, obj_to_write_in_file) + "\n");
        }
        else {
            fs.appendFile(constants.LogsPath + '/' + constants.LogFileName + constants.LogExtension, utils.Print(constants.LogSyntax, obj_to_write_in_file) + "\n");
        }
        console.log(utils.Print(constants.LogSyntax, obj_to_write_in_console));
    }

    static error_color(message) {
        return cli_color.red.bold(message);
    }

    static success_color(message) {
        return cli_color.green(message);
    }

    static warning_color(message) {
        return cli_color.yellow(message);
    }

    static notice_color(message) {
        return cli_color.blue(message);
    }

    static printf(message, ...vars) {
        return this.Print(message, vars);
    }

    static Print(message, vars) {
        let str = message.toString();

        for(let prop in vars) {
            str = str.replace(new RegExp("\\{" + prop + "\\}", "gi"), vars[prop]);
        }
        str = str.replace(/{([a-zA-Z0-9_\-])+}/g, '');

        return str;
    }

    static ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }

    static get_object_methods(path_class) {
        path_class += '.js';

        let class_content = fs.readFileSync(path_class).toString();

        let regex = /\/\*\*\ \@method\ \*\/\n?[\t|\ ]{0,}([a-zA-Z0-9_\-]+)\(\) {/gi;

        let methodes = [];
        let matches;

        while ((matches = regex.exec(class_content)) !== null) {
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            methodes[methodes.length] = matches[1];
        }
        return methodes;
    }

    static get_object_vars(obj) {
        let vars = [];
        for(let prop in obj) {
            if(typeof obj[prop] !== 'function') {
                vars[vars.length] = prop;
            }
        }
        return vars;
    }

    static in(key_word, array) {
        for(let i=0, max=array.length; i<max; i++ ) {
            if(array[i] === key_word) {
                return true;
            }
        }
        return false;
    }

    static format_args(args) {
        let new_args = [];
        args.forEach(obj => {
            new_args[obj.split('=')[0]] = obj.split('=')[1];
        });
        return new_args;
    }
};