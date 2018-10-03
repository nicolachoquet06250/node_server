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

  write_disponible_port() {
    let ports = [];
    if(process.platform === 'darwin') {
      exec('netstat -a', (err, output) => {
        let regex = /[\ ]+/;
        let m;
        while ((m = regex.exec(output)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          // if (m.index === regex.lastIndex) {
          //   regex.lastIndex++;
          // }
          console.log(m[2]);
        }
      });
    }
    else {
      let regex = process.platform === 'linux' ?
        /[a-zA-Z0-9]+[\ |\t]+[0-9]+[\ |\t]+[0-9]+[\ |\t]+([a-z0-9\-\.\[\:\]]+)\:([a-z\-0-9]+)[\ |\t]+([a-z0-9\-\.\[\:\]]+)\:([a-z0-9\-\*]+)[\ |\t]+[0-9a-zA-Z\_\ ]+/g
        : /[a-zA-Z]+[\ |\t]+([0-9\.]+)\:([0-9]+)[\ |\t]+[a-zA-Z\:0-9]+[\ |\t]+[a-zA-Z]+/;

      exec('netstat -a', (err, output) => {
        let m;
        while ((m = regex.exec(output)) !== null) {
          if (m.index === regex.lastIndex) regex.lastIndex++;
          let port_generated = '';

          for(let i = 0, max = 5; i<max; i++) {
            port_generated += Math.floor(Math.random() * Math.floor(9))
          }
          port_generated = parseInt(port_generated);

          let parsed = parseInt(m[2]);
          if (isNaN(parsed)) { parsed = m[2] }
          if(typeof parsed === 'number') {
            console.log(port_generated, parsed);
            if(port_generated !== parsed) {
              return parsed;
            }
            fs.writeFileSync(`${__dirname}/../server/conf/server_infos.json`, JSON.stringify({
              ServerPort: parsed
            }));
            // return port_generated === parsed ? this.get_disponible_port() : parsed;
          }
        }
      });
    }
  }
}

module.exports = new process_logs();