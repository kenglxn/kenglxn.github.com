---
layout: post
title: simple http serve a directory from terminal
---

Very often I need to look at some files in the browser.
For this I use [http-server](https://www.npmjs.com/package/http-server). It is a lightweight and simple cli http server for node.

Just install it with npm:

```bash
npm install http-server -g
```

Then run it:
```bash
http-server . -c-1
```
The -c-1 arg busts the cache (cache =-1)

For convenience I have a small [fish](http://fishshell.com/) function for it:

```bash
function serve
  http-server $argv -c-1
end
```

So when I want to serve something I just do:

```bash
serve .
 Starting up http-server, serving . on: http://0.0.0.0:8080
 Hit CTRL-C to stop the server
```
