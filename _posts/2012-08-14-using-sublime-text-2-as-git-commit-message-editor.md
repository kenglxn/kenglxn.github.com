---
layout: post
title: Using Sublime Text 2 as git commit message editor
---

[Sublime Text](http://www.sublimetext.com/) is a very nice, lightweight, and highly custimizable text editor.

Once you have it installed, set up a symlink so you can launch it from the command line.
**NOTE: do not use alias, as it behaves differently, and wont necessarily play nice with git.**

```bash
sudo ln -s /Applications/Sublime\ Text\ 2.app/Contents/SharedSupport/bin/subl /usr/bin/subl
```

This will enable you to launch subl with a directory argument, such as:

```bash
subl ~/projects/foo
## or
subl .
```

Git can be configured to use this editor with the following command:

```bash
git config --global core.editor "subl --wait"
```

Now Sublime will pop up when you do a git commit without a message. After writing the commit message, just save and quit sublime.

Additionally, if you install the [git plugin](https://github.com/kemayo/sublime-text-2-git/wiki) you will be able to get the diff view in the commit message by supplying -v

```bash
git commit -v
```

![](/attachments/git-diff-ci.png)
