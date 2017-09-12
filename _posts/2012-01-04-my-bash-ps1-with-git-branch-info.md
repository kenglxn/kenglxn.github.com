---
layout: post
title: My Bash PS1 with git branch info
---

I spent an hour playing around with my bash PS1 setting.
I wanted some useful information about which git branch I am on, and some colors.

After reading a couple of articles on it like [this one](http://www.wiredrevolution.com/bash-programming/customize-the-bash-ps1-command-prompt) and [this one](http://www.thegeekstuff.com/2008/09/bash-shell-ps1-10-examples-to-make-your-linux-prompt-like-angelina-jolie/) I tried it a bit myself and ended up with this:

![](/attachments/ps11.png):/attachments/ps11.png

Here is the PS1 code:

{% highlight bash %}
PS1_END_SIGN=

export PS1='  \[\e[1;36m\]$(git branch &>/dev/null; if [ $? -eq 0 ]; then echo " ($(git branch | grep '^*' |sed s/\*\ //))"; fi)  \[\e[1;37m\] $PS1_END_SIGN \[\e[00m\]  '
{% endhighlight %}

The PS1\_END\_SIGN can be set to anything you want.
The PS1 setting includes some coloring and output of the current branch if you are in a git repository.
