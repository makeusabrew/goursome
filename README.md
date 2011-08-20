# goursome

Visualise your git commits in real time via the magic of [gource](https://github.com/acaudwell/Gource)
and [node.js](https://github.com/joyent/node).

## Realtime?

Okay, not exactly. What it really does is pass in details of any commits made as soon as it's notified about them -
how and when it gets notified is flexible, though it was primarily built to be triggered by a `post-receive` git hook;
e.g. when someone performs a `git push`. You can use it as a `post-commit` hook if you like, or however you want (your
mileage may vary).

## How It Works

Pretty crudely at the moment. Your post-receive hook (or other, whatever's most suitable) invokes your node server and
passes it information about any updated commit references, which in turn updates a local git repo, gets the log details for
the input revision references and then writes the output to stdout, which is piped into gource's stdin. Gource itself
takes care of everything else - all goursome does is provide a way of getting it new data in a manner which lends itself
well to simplistic remote invocation (e.g. over http).

## Quick Install

1) Make sure you've got node properly installed, as goursome needs it to run

2) Clone this repository to wherever you choose

3) Run:

    ./server.js /path/to/local/git/repo/ project_namespace | gource --log-format git -i 0 -

4) On a remote, slap this in your `post-receive`:

    read oldrev newrev refname
    curl -d "oldrev=$oldrev&newrev=$newrev&refname=$refname&namespace=project_namespace" http://your-server-address:2424/ > /dev/null 2>&1

5) You're done!

## Use Cases

The primary use case is to have a permanent, up-to-date visualisation of a project's source tree on show in a team environment.
Given the distributed nature of git, goursome will work best as a post-receive hook on a remote repository which everyone in the team
pushes to - e.g. in the most svn-esque use case where everyone in the team pushes to a main remote.

## Current Limitations

Plenty of them:

* each visualisation is bound to a single HTTP server - can't run more than one per machine without altering port bindings (easily solved)
* visualised repository must be on the local filesystem - this was a design decision but can't remember why now. *Far* less HTTP traffic
involved in just sending commit refs rather than log messages was definitely one concern
* visualised repository must be able to perform a `git pull` without interaction (e.g. no password or passphrase prompt)
* no concept of branches - post-receive will always trigger, so it's master or bust for now
* error intolerant - if something goes wrong, goursome won't really tell you, and bad things will probably happen

## License

(The MIT License)

Copyright (C) 2011 by Nick Payne <nick@kurai.co.uk> 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE
