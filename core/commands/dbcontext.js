"use strict";
let constants = require(require('../../constantsPath'));
let cmd = require(constants.CoreUtilsPath + '/cmd');
let base = require(constants.CoreUtilsPath + '/Object');
let fs = require('fs');

module.exports = class dbcontext extends cmd {
    after_construct() {
        this.object = new base('dbcontext');
    }

    migrate() {
        let path = constants.RootPath + '/dbcontext';
        let contexts = fs.readdirSync(path);
        contexts.forEach(file => {
            if(require(path + '/' + file) === false)
                console.log('ERROR: l\'enregistrement du context \`' + file.split('.')[0] + '\` à échoué !');
        });
        console.log(this.get('var'));
    }
};