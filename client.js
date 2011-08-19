#!/usr/bin/env node

var util = require('util'),
    spawn = require('child_process').spawn,
    http = require('http'), 
    host = "127.0.0.1",
    port = 2424;

// check for argument overrides
if (typeof process.argv[2] != 'undefined') {
    host = process.argv[2];
}

if (typeof process.argv[3] != 'undefined') {
    port = process.argv[3];
}

var options = {
    host: host,
    port: port,
    path: '/'
};

http.get(options, function(res) {
    // we have to be quiet - we don't really want to spam users shells
    process.exit(0);
}).on('error', function(e) {
    process.exit(1);
});
