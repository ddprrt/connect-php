/*
 * connect-php
 * https://github.com/ddprrt/connect-php
 *
 * Copyright (c) 2013 Stefan Baumgartner
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;

module.exports = function phpMiddleware(directory)
{
    // necessary to check the .php extensions
    if (typeof String.prototype.endsWith !== 'function')
    {
        String.prototype.endsWith = function(suffix)
        {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    return function(req, res, next)
    {
        if (req.url.indexOf('.php?') > -1)
        { // We were passed $_GET parameters            
            var reqSplit = req.url.split('?');
            var params = reqSplit[1].split('&').join(' ');
            var command = 'php-cgi -f ' + directory + reqSplit[0] + ' ' + params; // eg. php-cgi -f index.php left=1058 right=1067 class=A language=English                        
            exec(command, function callback(error, stdout, stderr)
            {
                if (error)
                {
                    console.error(stderr);
                }
                res.write(stdout);
                res.end();
            });
        }
        else if (req.url.endsWith('.php'))
        { // We were not passed $_GET parameters
            exec('php ' + directory + req.url, function callback(error, stdout, stderr)
            {
                if (error)
                {
                    console.error(stderr);
                }
                res.write(stdout);
                res.end();
                return;
            });
        }
        else
        {
            // No .php file? Moving on ...
            next();
        }
    };
};
