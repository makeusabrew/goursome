#!/usr/bin/env node

var util = require('util'),
    spawn = require('child_process').spawn,
    http = require('http'), 
    querystring = require('querystring'),
    fs = require('fs');
    path = null,
    host = null,
    port = null,
    oldrev = null,
    newrev = null;

host = process.argv[2];
port = process.argv[3];
oldrev = process.argv[4];
newrev = process.argv[5];
path = process.argv[6] || process.cwd();

var options = {
    host: host,
    port: port,
    method: 'POST',
    path: '/'
};

var log = spawn('git', ['log',  '--pretty=format:user:%aN%n%ct', '--reverse', '--raw', '--encoding=UTF-8', '--no-renames', oldrev+'..'+newrev]);
var logData = '';

log.stdout.on('data', function(data) {
    logData += data;
});

log.on('exit', function(code) {
    // let's bung all our commit data off to the server if all went well
    if (code == 0) {
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
        });

        var payload = querystring.stringify({
            revdata: logData,
            key: "123"  // for future stuff, maybe
        });

        req.write(payload);
        req.end();
    } else {
        process.exit(1);
    }
});
