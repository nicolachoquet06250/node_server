"use strict";
let constants = require(require('../../server/constantsPath'));
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
            if(file.substr(0, 1) !== '.' && file !== 'LICENCE' && file !== 'README.md' && file !== 'node_modules' && file.substr(file.length-4, 4) !== '.log' && file.substr(file.length-4, 4) !== '.png' && file.substr(file.length-4, 4) !== '.jpg' && file.substr(file.length-4, 4) !== '.svg') {
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
        this.readdir(constants.RootPath);
        let nb_lines = 0;
        let nb_file = 0;

        Object.keys(this.files_array).forEach(key => {
            let array = this.files_array[key];
            array.forEach(value => {
                let path = key + '/' + value;
                let file_content = fs.readFileSync(path).toString();
                file_content = file_content.split("\n");
                nb_lines += file_content.length;
                nb_file++;
            });
        });

        let moyenne = nb_lines / nb_file;

        return {lines_per_file: moyenne};
    }

    /** @method */
    lines_for_file_json() {
        this.readdir(constants.RootPath);

        let path = constants.RootPath + '/' + this.args.get('GET')['path'];
        let file_content = fs.readFileSync(path).toString();
        file_content = file_content.split("\n");
        let nb_lines = file_content.length;

        return {lines_for_file: nb_lines};
    }

    /** @method */
    lines_total_json() {
        this.readdir(constants.RootPath);
        let nb_lines = 0;

        Object.keys(this.files_array).forEach(key => {
            let array = this.files_array[key];
            array.forEach(value => {
                let path = key + '/' + value;
                let file_content = fs.readFileSync(path).toString();
                file_content = file_content.split("\n");
                nb_lines += file_content.length;
            });
        });

        return {nb_lines: nb_lines};
    }

    /** @method */
    list_urls_json() {
        return [
            constants.Host + ':' + constants.ServerPort + '/count/files.json',
            constants.Host + ':' + constants.ServerPort + '/count/lines_per_file.json',
            constants.Host + ':' + constants.ServerPort + '/count/lines_for_file.json?path=<path>',
            constants.Host + ':' + constants.ServerPort + '/count/lines_total.json'
        ];
    }
};