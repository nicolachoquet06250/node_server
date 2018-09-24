delete process.argv[0];
delete process.argv[1];
let argv = [];
process.argv.forEach(obj => {
    if(obj !== '' && obj !== undefined && obj !== null) {
        argv[argv.length] = obj;
    }
});

let constants = require(require('./constantsPath'));
let commands = require(constants.CoreUtilsPath + '/command');

commands.execute(argv.join(' '));