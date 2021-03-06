---
layout: post
title: gitr&colon; recursive git command runner
---

Working across several git repositories can be cumbersome. I have on multiple occasions been tempted to script a set of git commands to run on multiple repositories. I finally decided to make a simple tool that I could run from any directory that would recursively run the git command I fed it on all git repositories located beneath that directory.

gitr
----

[gitr](http://kenglxn.github.io/gitr/) is available from [npm](https://npmjs.org/package/gitr) by issuing the following command:

```bash
npm install -g gitr
```

After this you can run git commands as you normally would by issuing the 'gitr' command, and gitr will figure out what directories it needs to run them on.
```bash
gitr status
gitr pull
gitr "log --since '1 day ago' --oneline --pretty=format:'%s'"
```
