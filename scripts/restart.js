"use strict";
const process_logs = require('../common/process_logs');

// let root_path = fs.realpathSync(`${__dirname}/../`);
// let scripts_logs_path = `${root_path}/scripts_logs`;
//
// function stop (type, root_path, scripts_logs_path) {
//   const pid = fs.readFileSync(`${scripts_logs_path}/${type}_pid.log`);
//   if(!process.kill(pid)) {
//     if(!fs.existsSync(scripts_logs_path)) fs.mkdirSync(scripts_logs_path);
//     fs.writeFileSync(`${scripts_logs_path}/${type}_stop_error.log`, `${pid} : processus not found !`);
//   }
//
// }
// function run(root_path, scripts_logs_path, type) {
//   function write_pid(scripts_logs_path, type, pid) {
//     fs.writeFileSync(`${scripts_logs_path}/pid_${type}.log`, pid);
//   }
//
//   write_pid(scripts_logs_path, type, exec(`cd ${root_path}/${type}; npm start`, err => {
//     if (err) {
//       if(!fs.existsSync(scripts_logs_path)) fs.mkdirSync(scripts_logs_path);
//       fs.writeFileSync(`${scripts_logs_path}/${type}_start_error.log`, err);
//       return;
//     }
//   }).pid);
// }
// function restart (type, root_path, scripts_logs_path) {
//   stop(type, root_path, scripts_logs_path);
//   run(root_path, scripts_logs_path, type);
// }
// function stop_all (root_path, scripts_logs_path) {
//   stop('app', root_path, scripts_logs_path);
//   stop('server', root_path, scripts_logs_path);
// }
// function run_all (root_path, scripts_logs_path) {
//   run(root_path, scripts_logs_path, 'server');
//   run(root_path, scripts_logs_path, 'app');
// }
// function restart_all (root_path, scripts_logs_path) {
//   stop_all(root_path, scripts_logs_path);
//   run_all(root_path, scripts_logs_path);
// }

let type;
if(process_logs.get_argv()[2] !== undefined && process_logs.dir_exists() && (type=process_logs.get_argv()[2])) process_logs.restart(type);
else process_logs.restart();