"use strict";
let constants = require(require('../../constantsPath'));
let conf = require(constants.CoreConfPath + '/conf');
let fs = require('fs');

module.exports = class command {
    static execute(cmd) {
        cmd = cmd.split(' ');
        let command_base = cmd[0];
        let tmp = [];
        cmd.forEach((obj, key) => {
            if(key !== 0) {
                let arg = obj.split('=');
                tmp[arg[0]] = arg[1];
            }
        });
        let argv = tmp;

        let command_class = command_base.split(':')[0];
        let command_method = command_base.split(':')[1];
        if(fs.existsSync(constants.CoreCommandsPath + '/' + command_class + conf.get_files_extensions()['js'])) {
            let command = require(constants.CoreCommandsPath + '/' + command_class);
            let cmd = new command(argv);
            cmd.execute(command_method);
        }
    }
};