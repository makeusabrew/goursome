#!/usr/bin/env node

var util = require('util'),
    spawn = require('child_process').spawn,
    querystring = require('querystring'),
    http = require('http');

var createServer = function() {
    http.createServer(function(req, res) {
        // simply listen out for POST requests
        if (req.method == 'POST') {
            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                var postvars = querystring.parse(body);

                // we assume revdata is lovely git log info ready for gource
                // obviously, this needs more checking as at the moment it's just
                // a totally blind proxy
                process.stdout.write(postvars.revdata);

                res.writeHead(200, {'Content-Type' : 'text/plain'});
                res.end('OK');
            });
        }
    }).listen(2424);
}

// optional initial population for gource can come from argv
if (typeof process.argv[2] != 'undefined') {
    var path = process.argv[2];
    try {
        process.chdir(path);
    } catch (e) {
        console.log("Bad dir argument ["+path+"]");
        process.exit(1);
    }

    var log = spawn('git', ['log',  '--pretty=format:user:%aN%n%ct', '--reverse', '--raw', '--encoding=UTF-8', '--no-renames']);
    log.stdout.on('data', function(data) {
        process.stdout.write(data);
    });

    log.on('exit', function(code) {
        if (code) throw new Error('Bad Code: '+code);
        createServer();
    });
} else {
    createServer();
}
