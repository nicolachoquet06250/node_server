"use strict";
let constants = require(require('../../constantsPath'));
let utils = require(constants.CoreUtilsPath + '/utils');
let args_class = require(constants.CoreParsersPath + '/args');
let fs = require('fs');
let http_server = require(constants.CoreHttpPath + '/http_server');
let http = new http_server();
let Error = require(constants.ViewsFormatPath + '/Error');
let uri = require(constants.CoreParsersPath + '/uri');
let confs = require(constants.CoreConfPath + '/conf');
let qs = require("querystring");
let formidable = require('formidable');
const {exec} = require('child_process');
let process_logs = require('../../../common/process_logs');

http.createServer((request, response, log) => {

    if(utils.in(request.method, constants.HttpMethods)) {
        let body='';
        let _files = {};
        let _fields = {};

        request.on('data', data => {
            body += data;
        });

        let form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
            _fields = fields;
            _files = files;
        });

        request.on('end',() => {
            try {
                let url = request.url;

                let uri_obj = new uri(url, request, qs.parse(body));
                let controller = uri_obj.get_controller();
                let method = uri_obj.get_method();
                let format = uri_obj.get_format();
                let http_method_used = uri_obj.get_http_method();
                let redirect = uri_obj.get_redirect();
                let args = uri_obj.get_args();

                if (redirect !== null && redirect !== undefined) {
                    utils.http_log(request, response, `Redirection ${redirect.code} vers ${constants.Host}:${constants.ServerPort}${redirect.url}`);
                    response.writeHead(redirect.code, {Location: `${constants.Host}:${constants.ServerPort + redirect.url}`});
                    response.end();
                    return;
                }
                if (controller === 'static') {
                    args = new args_class(args);
                    let file = args.get('f');
                    let path;
                    if (method === 'css') {
                        if (args.get('a')) {
                            let authorisations = confs.get_authorizations('scss');
                            authorisations = new args_class(authorisations);
                            let files;
                            if ((files = authorisations.get(args.get('a'))) !== false) {
                                let concat = '';
                                files.forEach(file => {
                                    if (fs.existsSync(`${constants.ScssSources}/${file}${constants.filesExtensions['sass']}`)) {
                                        concat += fs.readFileSync(`${constants.ScssSources}/${file}${constants.filesExtensions['sass']}`).toString() + "\n";
                                    }
                                });
                                fs.writeFile(`${constants.ScssSources}/${constants.ScssUncompileSuffix}${args.get('a')}${constants.filesExtensions['sass']}`, concat);
                                exec(constants.SassCompilationCommand(args.get('a')), () => {
                                    exec(constants.SassCompilationCommand(args.get('a'), true), (err, out) => {
                                        if (out !== '') {
                                            response.write(out);
                                            response.end();
                                        }
                                    });
                                });
                            }
                            file = `${constants.ScssCompileSuffix}${args.get('a')}${constants.filesExtensions['css']}`;
                        } else {
                            path = `${constants.StaticsPath}/${method}/${file}`;
                            if (fs.existsSync(path)) {
                                response.writeHead(200, {'Content-Type': constants.StaticsMimeTypes['css']});
                                fs.readFile(path, null, function (err, data) {
                                    response.write(data.toString());
                                });
                            } else {
                                response.writeHead(404, {'Content-Type': constants.StaticsMimeTypes['css']});
                                response.write('');
                                response.end();
                                return;
                            }
                            response.end();
                        }

                        path = `${constants.StaticsPath}/${method}/${file}`;
                        if (fs.existsSync(path)) {
                            response.writeHead(200, {'Content-Type': constants.StaticsMimeTypes['css']});
                            fs.readFile(constants.ScssDestination + '/' + file, null, function (err, data) {
                            });
                        } else {
                            response.writeHead(404, {'Content-Type': constants.StaticsMimeTypes['css']});
                            response.write('');
                            response.end();
                            return;
                        }
                    }
                    else if (utils.in(method, constants.StaticsControllers) && method !== 'css') {
                        if (method === 'js') {
                            if (args.get('a')) {
                                let authorisations = confs.get_authorizations('js');
                                authorisations = new args_class(authorisations);
                                let files;
                                if ((files = authorisations.get(args.get('a'))) !== false) {
                                    let concat = '';
                                    files.forEach(file => {
                                        if (fs.existsSync(`${constants.JsSources}/${file}${constants.filesExtensions['js']}`)) {
                                            concat += fs.readFileSync(`${constants.JsSources}/${file}${constants.filesExtensions['js']}`).toString() + "\n";
                                        }
                                    });
                                    response.writeHead((concat === '' ? 404 : 200), {'Content-Type': constants.StaticsMimeTypes['js']});
                                    response.write(concat);
                                }
                                response.end();
                                return;
                            } else {
                                path = `${constants.StaticsPath}/${method}/${file}`;
                                if (fs.existsSync(path)) {
                                    response.writeHead(200, {'Content-Type': constants.StaticsMimeTypes['js']});
                                    fs.readFile(path, null, function (err, data) {
                                        response.write(data.toString());
                                    });
                                } else {
                                    response.writeHead(404, {'Content-Type': constants.StaticsMimeTypes['js']});
                                    response.write('');
                                    response.end();
                                    return;
                                }
                                response.end();
                                return;
                            }
                        }
                        if (fs.existsSync(`${constants.StaticsPath}/${method}/${file}`)) {
                            if (constants.StaticsMimeTypes[method] !== undefined) {
                                let mime;
                                if (constants.StaticsMimeTypes[method].split('/')[1] !== '') {
                                    mime = constants.StaticsMimeTypes[method];
                                } else {
                                    mime = constants.StaticsMimeTypes[method] + method;
                                }
                                response.writeHead(200, {'Content-Type': mime});
                            }
                            response.write(fs.readFileSync(`${constants.StaticsPath}/${method}/${file}`));
                        } else {
                            if (constants.StaticsMimeTypes[method] !== undefined) {
                                let Error_obj = new Error(response, 404);
                                Error_obj.request(request);
                                Error_obj.type('html');
                                Error_obj.message(constants.FileNotFoundMessage(file));
                                Error_obj.display(request);
                                response.end();
                                return;
                            }
                        }
                        response.end();
                    }
                }
                else {
                    if (http_method_used !== null && http_method_used !== undefined && http_method_used !== request.method) {
                        let Error_obj = new Error(response, 500);
                        Error_obj.request(request);
                        Error_obj.type(format);
                        Error_obj.message(constants.HttpMethodUsedError(request.method));
                        Error_obj.display(request);
                        response.end();
                        return;
                    }
                    else {
                        if (fs.existsSync(`${constants.MvcControllersPath}/${controller}${constants.filesExtensions['js']}`)) {
                            let ctrl = require(`${constants.MvcControllersPath}/${controller}`);
                            let ctrl_obj = new ctrl(request, response);
                            ctrl_obj.object.setClass(controller);
                            let model = ctrl_obj.model(method, args, _fields, _files, format);
                            if (typeof model === 'object' && model instanceof Error) {
                                model.display(request);
                                response.end();
                                return;
                            } else {
                                let view = ctrl_obj.view(format);
                                if (typeof view === "object" && view instanceof Error) {
                                    view.type(format);
                                } else {
                                    log(request, response, null);
                                }
                                view.display(request);
                                response.end();
                            }
                        } else {
                            let Error_obj = new Error(response, 404);
                            Error_obj.request(request);
                            Error_obj.type(format);
                            Error_obj.message(constants.ControllerNotFoundMessage(controller));
                            Error_obj.display(request);
                            response.end();
                            return;
                        }
                    }
                }
            }
            catch (e) {
                if(e.code === 'ENOENT') {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify({
                        type: 'error',
                        http_code: 500,
                        message: e.code + ': no such file or directory, ' + e.syscall + ' \'' + e.path + '\' !'
                    }));
                    response.end();
                    utils.http_log(request, response, e.code + ': no such file or directory, ' + e.syscall + ' \'' + e.path + '\' !');
                }
            }
        });
    }
    else {
        let Error_obj = new Error(response, 500);
        Error_obj.request(request);
        Error_obj.type('html');
        Error_obj.message(constants.HttpMethodNotManaged(request.method));
        Error_obj.display(request);
        response.end();
        return;
    }
}, constants.ServerPort);
process_logs.write_pid('app');

console.log(constants.ServerHomeMessage);