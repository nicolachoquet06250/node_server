"use strict";
const process_logs = require('../common/process_logs');
let type;
if(process_logs.get_argv()[2] !== undefined && process_logs.dir_exists() && (type=process_logs.get_argv()[2])) process_logs.run(type);
else process_logs.run();