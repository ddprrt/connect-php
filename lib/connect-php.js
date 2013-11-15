/*
 * connect-php
 * https://github.com/ddprrt/connect-php
 *
 * Copyright (c) 2013 Stefan Baumgartner
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;

module.exports = function phpMiddleware(directory) {

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    return function(req, res, next) {
        if(req.url.endsWith('.php')) {
            exec('php ' + directory + req.url, function callback(error, stdout, stderr){
                res.write(stdout);
                res.end();
                return;
            });
        } else {
            next();
        }
    }
}
