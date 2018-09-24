"use strict";

module.exports = class table {
    constructor(name) {
        this.table_name = name;
        this.fields = {};
    }

    set_field(field, type, default_value = null) {
        this.fields[field] = {
            type: type,
            default: default_value
        };
        return this;
    }

    get_fields() {
        return this.fields;
    }

    set_primary_key(field, active = true) {
        if(this.fields[field] !== undefined) {
            this.fields[field]['primary'] = active;
        }
        return this;
    }

    set_autoincrement(field, active = true) {
        if(this.fields[field] !== undefined) {
            this.fields[field]['autoincrement'] = active;
        }
        return this;
    }
};