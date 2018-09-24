"use strict";
let constants = require(require('../../constantsPath'));
let fs = require('fs');
let model = require(constants.CoreMvcPath + '/model');

module.exports = class count extends model {

    after_construct() {
        this.files_array = {};
    }

    readdir(path) {
        let files_array = fs.readdirSync(path);
        for(let i=0, max=files_array.length; i<max; i++) {
            let file = files_array[i];
            if(file.substr(0, 1) !== '.' && file !== 'LICENCE' && file !== 'README.md' && file !== 'node_modules'
                && file.substr(file.length-4, 4) !== '.log' && file.substr(file.length-4, 4) !== '.png'
                && file.substr(file.length-4, 4) !== '.jpg' && file.substr(file.length-4, 4) !== '.svg'
                && file.substr(file.length-5, 5) !== '.jpeg') {
                if(file.indexOf('.') === -1) {
                    this.readdir(path + '/' + file);
                }
                else {
                    if(this.files_array[path] === undefined) {
                        this.files_array[path] = [];
                    }
                    this.files_array[path][this.files_array[path].length] = file;
                }
            }
        }
    }

    /** @method */
    files_json() {
        this.readdir(constants.RootPath);
        let nb_files = 0;
        Object.keys(this.files_array).forEach(key => {
            nb_files += this.files_array[key].length;
        });
        return {
            nb_files: nb_files
        };
    }

    /** @method */
    lines_per_file_json() {
        let nb_lines_total = this.lines_total_json().lines_total;
        let nb_files = this.files_json().nb_files;

        let moyenne = nb_lines_total / nb_files;

        return {
            lines_per_file: moyenne
        };
    }

    /** @method */
    lines_for_file_json() {
        this.readdir(constants.RootPath);
        let nb_lines = 0;
        let path;
        let GET;
        if((GET = this.args.get('GET')) && ((path = GET['p']) || (path = GET['path']))) {
            if(fs.existsSync(constants.RootPath + '/' + path)) {
                let content = fs.readFileSync(constants.RootPath + '/' + path).toString();
                content = content.split("\n");
                nb_lines = content.length;
            }
        }
        return {
            nb_line: nb_lines
        };
    }

    /** @method */
    lines_total_json() {
        this.readdir(constants.RootPath);
        let nb_lines = 0;
        Object.keys(this.files_array).forEach(key => {
            this.files_array[key].forEach((_obj) => {
                let content = fs.readFileSync(key+'/'+_obj).toString();
                content = content.split("\n");
                nb_lines += content.length;
            });
        });
        return {
            lines_total: nb_lines
        };
    }

    /** @method */
    list_path_json() {
        return {
            nb_files: constants.Host + ':' + constants.ServerPort + '/count/files.json',
            lines_per_file: constants.Host + ':' + constants.ServerPort + '/count/lines_per_file.json',
            lines_for_file: constants.Host + ':' + constants.ServerPort + '/count/lines_for_file.json?p=<path>',
            lines_total: constants.Host + ':' + constants.ServerPort + '/count/lines_total.json'
        }
    }
};