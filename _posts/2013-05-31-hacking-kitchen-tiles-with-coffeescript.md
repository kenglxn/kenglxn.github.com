---
layout: post
title: hacking kitchen tiles with coffeescript
---

It was finally time to spruce up ye' ole' kichen. I had bought the tiles in shades of brown and white. The area to tile was about 50cm tall and 250cm wide. The tiles were 10cm x 10cm with 3mm spacers for the grout. Now all that remained was to find a pattern. I tried with pen and grid paper, but could not seem to find a pattern I liked. Then the idea struck me that this would be a great opportunity to hack a bit. I decided I wanted to encode something as binary ascii in the tiles, while making a tile pattern I found appealing. I ended up using this awesome [Boilerplate project using CS, AMD, Mocha and Testem](http://smuco.de/2013/04/25/coffeescript-amd-mocha-testem.html) by [@smucode](https://twitter.com/smucode) to create a small app that takes some input and converts it to binary ascii before rendering some tiles with a bit of border.

![](/attachments/bin-ascii-tiles.png)https://github.com/kenglxn/bin-ascii-tiles

Please keep in mind that the whole thing was thrown together in an evening, so don't expect the world. The [code is on github](https://github.com/kenglxn/bin-ascii-tiles), and [running live here](http://kenglxn.github.io/bin-ascii-tiles/)

The result
----------

I was rather pleased with the end result, but better than that is that my wife ended up loving it. When I told her that I had encoded a message in the tiles, she said "you're such a nerd" with a smile :)

![](/attachments/coffee-kitchen.png)

The Code
--------

The whole app is just 33 lines of coffee, and looks like this:

```coffeescript
define ['underscore', 'jquery'], (_, $) ->
  class App
    init: =>
      main = $("#main")
      input = $("#input")
      stats = $("#stats")
      input.keyup =>
        val = @convert(input.val())
        main.html('')
        for v in val
          main.append("<span class='#{if v is '0' then "light" else "dark"}'></span>")
        stats.text(JSON.stringify(@stats(val), null, 2))

    convert: (input) ->
      output = ''
      for char in input
        bin = char.charCodeAt(0).toString(2)
        output += "00000000#{bin}".substring(char.charCodeAt(0).toString(2).length)
      output

    stats: (val) =>
      stats = _.countBy val, (v) =>
        if v is '0' then "zeros" else "ones"
      _.extend stats,
        count: val.length
        ratio: @reduce(stats.zeros, stats.ones).join('/')

    reduce: (num, denom) =>
      gcdFn = (a,b) ->
        if b then gcdFn(b, a % b) else a
      gcd = gcdFn num, denom
      [num / gcd, denom / gcd]
```

Driven forth by a test suite about equal in size:

```coffeescript
define ['cs!src/coffee/app'], (App) ->
  describe 'App', ->

    it 'should be defined', ->
      App.should.be.defined

    it 'should convert text to binary ascii', ->
      app = new App
      ascii = app.convert 'foo'
      ascii.length.should.equal 24
      ascii.should.match /^[01]+$/g
      ascii.should.equal '011001100110111101101111'

    it 'should create stats from input', ->
      app = new App
      stats = app.stats '011001100110111101101111'
      console.log stats
      stats.should.have.property 'count'
      stats.count.should.equal 24
      stats.should.have.property 'zeros'
      stats.zeros.should.equal 8
      stats.should.have.property 'ones'
      stats.ones.should.equal 16
      stats.should.have.property 'ratio'
      stats.ratio.should.equal '1/2'


    it 'should reduce ratio', ->
      app = new App
      reduced = app.reduce 8, 16
      reduced.should.eql [1, 2]
```
