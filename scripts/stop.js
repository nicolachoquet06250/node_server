'use strict';
const process_logs = require('../common/process_logs');

// let root_path = fs.realpathSync(`${__dirname}/../`);
// let scripts_logs_path = `${root_path}/scripts_logs`;
//
// function stop (type, root_path, scripts_logs_path) {
//   const pid = fs.readFileSync(`${scripts_logs_path}/${type}_pid.log`);
//   if(!process.kill(pid)) {
//     if(!fs.existsSync(scripts_logs_path)) fs.mkdirSync(scripts_logs_path);
//     if(!fs.existsSync(`${scripts_logs_path}/errors`)) fs.mkdirSync(`${scripts_logs_path}/errors`);
//     fs.writeFileSync(`${scripts_logs_path}/errors/${type}_stop_error.log`, `${pid} : processus not found !`);
//   }
//   else {
//     fs.unlink(`${scripts_logs_path}/pids/${type}_pid.log`);
//   }
// }
// function stop_all (root_path, scripts_logs_path) {
//   stop('app', root_path, scripts_logs_path);
//   stop('server', root_path, scripts_logs_path);
// }

let type;
if(process_logs.get_argv()[2] !== undefined && process_logs.dir_exists() && (type=process_logs.get_argv()[2])) process_logs.stop(type);
else process_logs.stop();