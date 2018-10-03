'use strict';
const { exec } = require('child_process');
let fs = require('fs');

class process_logs {
  constructor() {
    this.root_path = fs.realpathSync(`${__dirname}/../`);
    this.scripts_logs_path = `${this.root_path}/scripts_logs`;
    this.argv = process.argv;
    this.pid = process.pid;
  }

  write_error(type, mode, error) {
    this.create_errors_dir();
    fs.writeFileSync(`${this.scripts_logs_path}/errors/${type}_${mode}_error.log`, error);
  }

  write_pid(type) {
    this.create_pids_dir();
    fs.writeFileSync(`${this.scripts_logs_path}/pids/${type}_pid.log`, this.pid);
  }

  create_pids_dir() {
    if(!fs.existsSync(this.scripts_logs_path)) fs.mkdirSync(this.scripts_logs_path);
    if(!fs.existsSync(`${this.scripts_logs_path}/pids`)) fs.mkdirSync(`${this.scripts_logs_path}/pids`);
  }

  create_errors_dir() {
    if(!fs.existsSync(this.scripts_logs_path)) fs.mkdirSync(this.scripts_logs_path);
    if(!fs.existsSync(`${this.scripts_logs_path}/errors`)) fs.mkdirSync(`${this.scripts_logs_path}/errors`);
  }

  run(type='all') {
    if(type === 'all') {
      this.run('server');
      this.run('app');
    }
    else {
      exec(this.run_cmd(type), err => {
        if (err) this.write_error(type, 'start', err);return;
      });
    }
  }

  stop(type='all') {
    if (type === 'all') {
      this.stop('server');
      this.stop('app');
    }
    else {
      const pid = fs.readFileSync(`${this.scripts_logs_path}/pids/${type}_pid.log`);
      if (!process.kill(pid)) this.write_error(type, 'stop', `${pid} : processus not found !`);
      else fs.unlink(`${this.scripts_logs_path}/pids/${type}_pid.log`);
    }
  }

  restart(type='all') {
    this.stop(type);
    this.run(type);
  }

  run_cmd(type) {
    return `cd ${this.root_path}/${type}; npm start &`;
  }

  get_argv() {
    return this.argv;
  }

  dir_exists() {
    return fs.existsSync(`${this.root_path}/${this.get_argv()[2]}`)
  }
}

module.exports = new process_logs();