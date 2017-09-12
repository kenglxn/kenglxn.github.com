---
layout: post
title: mvnr&colon; recursive mvn command runner
---

I recently had an issue with many [Maven](http://maven.apache.org/) repositories being part of the same project source code, while not sharing a common aggregate pom. Although the rationale behind a setup like this is often well justified, that does not make it any easier for developers working on source code across such a scattered strucutre. With this in mind I decided to create a node command line tool which recursively runs any supplied maven command on all maven projects found under the current working directory. [MVNR](http://kenglxn.github.io/mvnr/) does an honest attempt at figuring out which of the known maven artifacts need to be built first. In other words mvnr tries to figure out which of the artifacts under the current working directory needs to be built first in order for other artifacts to successfully be built with these as dependencies, recursively.

mvnr
----

[mvnr](http://kenglxn.github.io/mvnr/) is available from [npm](https://npmjs.org/package/mvnr) by issuing the following command:

{% highlight bash %}
npm install -g mvnr
{% endhighlight %}

After this you can run maven commands as you normally would by issuing the 'mvnr' command, and mvnr will figure out what directories it needs to run them on.
{% highlight bash %}
mvnr clean install
{% endhighlight %}

caveat
------

since mvnr uses 'mvn -f', which some plugins unfortunately do not respect, you may have pom configurations which have plugins using relative paths which assume cwd. This will not work very well.
