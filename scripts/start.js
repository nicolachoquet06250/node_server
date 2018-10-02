"use strict";
const process_logs = require('../common/process_logs');

// let root_path = fs.realpathSync(`${__dirname}/../`);
// let scripts_logs_path = `${root_path}/scripts_logs`;
//
// function run(root_path, scripts_logs_path, type) {
//
//   exec(`cd ${root_path}/${type}; npm start &`, (err, stdout) => {
//     if (err) {
//       if(!fs.existsSync(scripts_logs_path)) fs.mkdirSync(scripts_logs_path);
//       fs.writeFileSync(`${scripts_logs_path}/${type}_start_error.log`, err);
//       return;
//     }
//   });
// }
// function run_all (root_path, scripts_logs_path) {
//   run(root_path, scripts_logs_path, 'server');
//   run(root_path, scripts_logs_path, 'app');
// }

let type;
if(process_logs.get_argv()[2] !== undefined && process_logs.dir_exists() && (type=process_logs.get_argv()[2])) {
  process_logs.run(type);
}
else process_logs.run();