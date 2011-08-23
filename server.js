#!/usr/bin/env node

var util = require('util'),
    spawn = require('child_process').spawn,
    querystring = require('querystring'),
    http = require('http'),
    redis = require('redis'),
    pub = redis.createClient();

http.createServer(function(req, res) {
    // simply listen out for POST requests
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var postvars = querystring.parse(body);

            if (postvars.namespace && postvars.oldrev && postvars.newrev) {
                console.log('sending refs ['+postvars.oldrev+'] .. ['+postvars.newrev+'] to channel ['+postvars.namespace+']');

                //socket.send(postvars.namespace+' '+JSON.stringify(postvars));
                pub.publish(postvars.namespace, JSON.stringify(postvars));
                res.writeHead(200, {'Content-Type' : 'text/plain'});
                res.end('OK\n');
            } else {
                res.writeHead(500, {'Content-Type' : 'text/plain'});
                res.end('Missing required parameters\n');
            }
        });
    } else {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('Use POST instead\n');
    }
}).listen(2424);
