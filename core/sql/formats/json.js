"use strict";

module.exports = class json {
    set_context(context) {
        this.context = context;
        this.conf = null;
        return this;
    }

    set_conf(conf) {
        this.context = null;
        this.conf = conf;
        return this;
    }

    select() {
        return this;
    }
    insert() {
        return this;
    }
    update() {
        return this;
    }
    delete() {
        return this;
    }
    create() {
        return this;
    }
    drop() {
        return this;
    }
    alter() {
        return this;
    }

    query() {
        return this;
    }
};