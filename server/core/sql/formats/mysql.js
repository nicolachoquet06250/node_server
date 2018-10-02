"use strict";

module.exports = class mysql {
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
    show() {
        return this;
    }

    query() {
        return this;
    }
};