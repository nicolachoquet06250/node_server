"use strict";
let confs = require('../conf/conf');
let fs = require("fs");

module.exports = new class constants {
    constructor() {
        this.TodayDate = new Date().toDateString();

        // Server Constants
        this.Host = 'http://localhost';
        this.ServerPort= 1337;

        // Path Constants
        this.RootPath = fs.realpathSync(`${__dirname}/../..`);
        this.CorePath = `${this.RootPath}/core`;
        this.CoreConfPath = `${this.CorePath}/conf`;
        this.CoreHttpPath = `${this.CorePath}/http`;
        this.CoreMvcPath = `${this.CorePath}/mvc`;
        this.CoreParsersPath = `${this.CorePath}/parser`;
        this.CoreUtilsPath = `${this.CorePath}/utils`;
        this.CoreSqlPath = `${this.CorePath}/sql`;
        this.CoreCommandsPath = `${this.CorePath}/commands`;
        this.ViewsPath = `${this.RootPath}/views`;
        this.ViewsFormatPath = `${this.ViewsPath}/formats`;
        this.ViewsLayoutsPath = `${this.ViewsPath}/layouts`;
        this.ViewErrorPath = `${this.CoreMvcPath}/views`;
        this.MvcPath = `${this.RootPath}/mvc`;
        this.MvcControllersPath = `${this.MvcPath}/controllers`;
        this.MvcModelsPath = `${this.MvcPath}/models`;

        // Logs Constants
        this.LogsPath = `${this.RootPath}/logs`;
        this.LogFileName = this.TodayDate.replace(/\ /g, '');
        this.LogSyntax = '[{date}] {host} [{statusCode}]: {url} {message}';
        this.LogExtension = '.log';

        // Confs Constants
        this.ConfsPath = `${this.RootPath}/conf`;
        this.JsAuthorisationsPath = `${this.ConfsPath}/js_authorizations.json`;
        this.CssAuthorisationsPath = `${this.ConfsPath}/scss_authorizations.json`;
        this.SqlConfs = `${this.ConfsPath}/sql_conf.json`;

        // Statics Files Constants
        this.StaticsPath = `${this.RootPath}/statics`;
        this.StaticsControllers = ['css', 'img', 'js'];
        this.StaticsMimeTypes = confs.get_statics_dirs();

        // Scss Constants
        this.ScssSources = `${this.StaticsPath}/scss`;
        this.ScssDestination = `${this.StaticsPath}/css`;
        this.ScssCompileSuffix = 'compile_';
        this.ScssUncompileSuffix = 'uncompile_';

        // Js Constants
        this.JsSources = `${this.StaticsPath}/js`;

        this.filesExtensions = confs.get_files_extensions();

        // Messages Constants
        this.ServerHomeMessage = `Server running on url ${this.Host}:${this.ServerPort}`;

        // Formats supported Constants
        this.formats= confs.get_formats();
        this.DefaultFormat= this.formats[1];

        this.HttpMethods = confs.get_http_methods();

        this.console = console;
    }

    ControllerNotFoundMessage(controller) {
        return `controller \`${controller}\` not found !`;
    }

    MethodNotFoundMessage(model, method, ext) {
        return `method \`${model}::${method}()\` for \`${ext}\` format not found !`;
    }

    FileNotFoundMessage(file) {
        return `\`${file}\` file not found !`;
    }

    SassCompilationCommand(file, get = false) {
        return get ? `cat ${this.ScssDestination}/compile_${file}.css` : `node-sass --output-style uncompressed ${this.ScssSources}/uncompile_${file}.scss > ${this.ScssDestination}/compile_${file}.css;rm ${this.ScssSources}/uncompile_${file}.scss`;
    }

    HttpMethodNotManaged(method) {
        return `http method \`${method}\` not managed !`;
    }

    HttpMethodUsedError(method) {
        return `not expected \`${method}\` http method`;
    }
};