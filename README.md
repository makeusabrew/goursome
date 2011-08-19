# GOURSOME!

Visualise your git commits in real time via the magic of [gource](https://github.com/acaudwell/Gource)
and [node.js](https://github.com/joyent/node).

## Quick Install

Make sure you've got node properly installed, as goursome needs it to run
Clone this repository to wherever you choose
Run:

   ./server.js /path/to/local/git/repo/ | gource --log-format git -i 0 -

On a remote, slap this in your `post-receive`:

   read oldrev newrev refname
   curl -d "oldrev=$oldrev&newrev=$newrev&refname=$refname" http://your-server-address:2424/ > /dev/null 2>&1

You're done!
