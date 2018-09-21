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
            if(file.substr(0, 1) !== '.' && file !== 'LICENCE' && file !== 'README.md' && file !== 'node_modules') {
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

    lines_per_file_json() {

    }

    lines_for_file_json() {

    }

    lines_total_json() {

    }
};