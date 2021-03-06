---
layout: post
title: civu, a CLI for cloning git repositories from jenkins views
---

The other day I was starting work on a project that had a large code base spread across many git repositories.
There was no defined list of which repositories I needed to clone, as it depended on what people were working on.
The team had just cloned the repositories as they saw the need.
I prefer to clone the whole codebase, so I have everything locally.
The project used jenkins, and on jenkins there was a structure based on views.
Each view was a set of builds relating to a product suite, or codebase.
This meant that all the repositories I needed where listed in a view on jenkins.

Ruby Hacking the civu CLI
-------------------------

The weekend came and I decided to do a bit of ruby hacking.
I wanted a simple CLI that would let me point at a jenkins and tell it which view I wanted to clone repositories for.

After a couple of days of hacking civu was born. [CIVU](https://github.com/kenglxn/civu) is available through [rubygems](http://rubygems.org/gems/civu).
Just install with gem and run it.

```bash
$ gem install civu
$ civu --help 
$ civu list viewname
$ civu clone viewname
```
