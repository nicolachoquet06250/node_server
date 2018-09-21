"use strict";
let constants = require(require('../../constantsPath'));
let utils = require(constants.CoreUtilsPath + '/utils');

module.exports = class uri {
    constructor(url, request, METHOD) {
        this.url = url;
        this.request = request;
        this.router = require(constants.CoreParsersPath + '/router');
        this.controller = '';
        this.method = '';
        this.format = '';
        this.httpMethod = 'GET';
        this.args = [];
        this.METHOD = METHOD;
        if(this.request.method === 'GET') {
            let args_get = this.url.split('?');
            if(args_get.length > 1) {
                this.url = args_get[0];
                args_get = args_get[1];
                args_get = args_get.split('&');
            }
            else {
                args_get = [];
            }
            args_get.forEach(obj => {
                if(obj !== '') {
                    let arg = obj.split('=');
                    if(this.args[this.request.method] === undefined) {
                        this.args[this.request.method] = {};
                    }
                    let value = decodeURI(arg[1]).replace(/\+/g, ' ').replace(/%2B/g, '+');
                    let parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                        value = parsed;
                    }
                    this.args[this.request.method][arg[0]] = value;
                }
            });

            let _url = this.url.split('/');
            _url.forEach((obj, key) => {
                if(obj !== '' && obj.indexOf('=') !== -1) {
                    let arg = obj.split('=');
                    let value = arg[1];
                    let parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                        value = parsed;
                    }
                    this.args[arg[0]] = typeof value === 'string' ? decodeURI(value) : value;
                    delete _url[key];
                }
            });
            this.url = _url.join('/').substr(_url.join('/').length-1, 1) === '/' ? _url.join('/').substr(0, _url.join('/').length-1) : _url.join('/');
        }
        this.parse();
    }

    parse() {
        let url_parsed = this.url.split('/');
        let args = [];

        url_parsed.forEach(obj => {
            if(obj.indexOf('=') !== -1) {
                let arg = obj.split('=');
                args[args.length] = decodeURI(arg.join('='));
                let value = arg[1];
                let parsed = parseInt(value);
                if (!isNaN(parsed)) {
                    value = parsed;
                }
                this.args[arg[0]] = typeof value === 'string' ? decodeURI(value) : value;
            }
        });
        Object.keys(this.METHOD).forEach(key => {
            let value = this.METHOD[key];
            let parsed = parseInt(value);
            if (!isNaN(parsed)) {
                value = parsed;
            }
            args[key] = typeof value === 'string' ? decodeURI(value) : value;
        });

        let url_probably_route = url_parsed.join('/').replace('/' + args.join('/'), '');
        if(url_probably_route.substr(0, 1) !== '/') {
            url_probably_route = '/' + url_probably_route;
        }

        if(this.router.has_route(url_probably_route)) {
            let route = this.router.get_route(url_probably_route);
            if(route['redirect'] !== undefined) {
                this.redirect = route['redirect'];
                this.controller = null;
                this.method = null;
                this.format = null;
                this.args = null;
                this.httpMethod = null;
            }
            else {
                this.redirect = null;
                this.controller = route['controller'];
                this.method = route['method'];
                this.format = route['format'];
                let args = route['args'];
                if (route['http_method'] !== undefined) {
                    this.httpMethod = route['http_method'];
                }
                Object.keys(args).forEach((key) => {
                    let value = args[key];
                    let parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                        value = parsed;
                    }
                    this.args[key] = typeof value === 'string' ? decodeURI(value) : value;
                });
            }
        }
        else {
            let routes = this.router.get_routes();
            let selected_route = false;
            let m, m1;
            Object.keys(routes).forEach(key => {
                if(m = key.match(/\{([a-zA-Z0-9\_]+)\}/g)) {
                    let url_match = key;
                    m.forEach(obj => {
                        url_match = url_match.replace(obj, '([a-zA-Z0-9\\_]+)');
                    });

                    if(m1 = url_probably_route.match(url_match)) {
                        let m_tmp = [];
                        delete m1[0];
                        delete m1['input'];
                        delete m1['index'];
                        m1.forEach(obj => {
                            if(obj !== '') {
                                m_tmp[m_tmp.length] = obj;
                            }
                        });
                        m1 = m_tmp;

                        let probably_url = url_probably_route;
                        m1.forEach((obj, key) => {
                            probably_url = probably_url.replace('/' + obj, '/' + m[key]);
                        });

                        if(this.router.has_route(probably_url)) {
                            selected_route = {
                                match: m,
                                match1: m1,
                                url: probably_url
                            };
                        }
                    }
                }
            });

            this.controller = url_probably_route.split('/')[1];
            let method = url_probably_route.split('/')[2];
            if(method !== undefined) {
                let _method = method.split('.');
                this.format = _method.length > 1 ? _method[1] : constants.DefaultFormat;
                this.method = _method.length > 1 ? _method[0] : method;
            }
            else {
                this.format = constants.DefaultFormat;
                this.method = null;
            }

            let files_extensions = constants.filesExtensions;
            if(selected_route && this.controller !== 'static' && !utils.in(this.method, Object.keys(files_extensions))) {
                let _args = {};
                selected_route.match.forEach((obj, key) => {
                    let value = selected_route.match1[key];
                    let parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                        value = parsed;
                    }
                    _args[obj.replace('{', '').replace('}', '')] = value;
                });
                let route = this.router.get_route(selected_route.url);
                this.controller = route['controller'];
                this.method = route['method'];
                this.format = route['format'];
                this.redirect = route['redirect'] !== undefined ? route['redirect'] : null;
                let args = route['args'];
                if (route['http_method'] !== undefined) {
                    this.httpMethod = route['http_method'];
                }
                Object.keys(args).forEach(key => {
                    let value = args[key];
                    let parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                        value = parsed;
                    }
                    this.args[key] = typeof value === 'string' ? decodeURI(value) : value;
                });

                Object.keys(this.args).forEach(key => {
                    if(_args[key] !== undefined) {
                        this.args[key] = typeof _args[key] === 'string' ? decodeURI(_args[key]) : _args[key];
                    }
                });
            }
        }
    }

    get_controller() {
        return this.controller;
    }

    get_method() {
        return this.method;
    }

    get_args() {
        return this.args;
    }

    get_format() {
        return this.format;
    }

    get_redirect() {
        return this.redirect;
    }

    get_http_method() {
        return this.httpMethod;
    }
};