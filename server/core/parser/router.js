"use strict";
let constants = require(require('../../constantsPath'));
let fs = require('fs');

class router {

    constructor() {
        this.router = JSON.parse(fs.readFileSync(constants.ConfsPath + '/router.json'));
    }

    static instence() {
        if(router._instence === null || router._instence === undefined) {
            router._instence = new router();
        }
        return router._instence;
    }

    get_route(key) {
        return this.has_route(key) ? this.router[key] : null;
    }

    has_route(key) {
        return (this.router[key] !== undefined);
    }

    get_routes() {
        return this.router;
    }
}

module.exports = router.instence();