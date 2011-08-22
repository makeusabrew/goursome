#!/usr/bin/env node

var util = require('util'),
    spawn = require('child_process').spawn,
    querystring = require('querystring'),
    path = process.argv[2],
    namespace = process.argv[3],
    http = require('http'),
    zeromq = require('zeromq');

var socket = zeromq.createSocket('sub');

try {
    process.chdir(path);
    process.stderr.write('changed to path ['+path+']\n');
} catch (e) {
    console.log("Bad dir argument ["+path+"]");
    process.exit(1);
}

socket.subscribe(namespace);
process.stderr.write('subscribed to channel ['+namespace+']\n');
socket.connect("tcp://127.0.0.1:5556");

socket.on('message', function(data) {
    var decoded = data.toString().split(" ");
    var msg = JSON.parse(decoded[1]);

    updateLog(msg.oldrev, msg.newrev, function(code) {
        process.stderr.write('Updated ['+msg.namespace+'] git repository\n');
    });
});

// initial data population
var log = spawn('git', ['log',  '--pretty=format:user:%aN%n%ct', '--reverse', '--raw', '--encoding=UTF-8', '--no-renames']);
log.stdout.on('data', function(data) {
    process.stdout.write(data);
});

log.on('exit', function(code) {
    if (code) throw new Error('Bad Code: '+code);
});

var updateLog = function(oldrev, newrev, callback) {
    spawn('git', ['pull']).on('exit', function(code) {
        if (code) throw new Error('Bad Code: '+code);

        var log = spawn('git', ['log',  '--pretty=format:user:%aN%n%ct', '--reverse', '--raw', '--encoding=UTF-8', '--no-renames', oldrev+'..'+newrev]);

        log.stdout.on('data', function(data) {
            process.stdout.write(data);
        });

        log.on('exit', function(code) {
            callback(code);
        });
    });
}
