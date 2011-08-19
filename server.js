#!/usr/bin/env node

var util = require('util'),
    spawn = require('child_process').spawn,
    http = require('http');

// was going to take path from the input request, but it makes more sense
// for the script to take the path from argv
var path = process.argv[2];

// right, initially, let's feed everything into gource to get it up-to-date
var origDir = process.cwd();
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

    http.createServer(function(req, res) {
        updateStdout(path, res);
    }).listen(2424, "127.0.0.1");

    var updateStdout = function(path, res) {
        var log = spawn('git', ['log',  '--pretty=format:user:%aN%n%ct', '--reverse', '--raw', '--encoding=UTF-8', '--no-renames', 'HEAD^..']);
        log.stdout.on('data', function(data) {
            process.stdout.write(data);
        });

        log.on('exit', function(code) {
            // anything?
            if (code == 0) {
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.end('{"ok":"true"}\n');
            } else {
                res.writeHead(500, {'Content-Type' : 'application/json'});
                res.end('{"err":"'+code+'"}\n');
            }
        });
    }
});
