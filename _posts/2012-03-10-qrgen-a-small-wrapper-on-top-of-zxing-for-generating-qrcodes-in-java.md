---
layout: post
title: QRGen, a small wrapper on top of ZXING for generating QRCodes in java
---

A couple of months ago I was looking at creating QR codes in java, and found [ZXING](http://code.google.com/p/zxing/), which is pretty awesome, you should check it out.

For convenience I made [a simple wrapper API](http://kenglxn.github.io/QRGen/) on top of zxing.

To put it to use just add the dependency to your project, and you will be able to get it from maven central:

example maven pom.xml

{% highlight xml %}
<dependencies>
  <dependency>
    <groupId>net.glxn</groupId>
    <artifactId>qrgen</artifactId>
    <version>1.4</version>
  </dependency>
</dependencies>
{% endhighlight %}

example build.gradle:

{% highlight groovy %}
dependencies {
  compile ("net.glxn:qrgen:1.4")
}
{% endhighlight %}

After that you can put it to use in your project:

{% highlight java %}
// get QR file from text using defaults
File file = QRCode.from("Hello World").file();
// get QR stream from text using defaults
ByteArrayOutputStream stream = QRCode.from("Hello World").stream();

// override the image type to be JPG
QRCode.from("Hello World").to(ImageType.JPG).file();
QRCode.from("Hello World").to(ImageType.JPG).stream();

// override image size to be 250x250
QRCode.from("Hello World").withSize(250, 250).file();
QRCode.from("Hello World").withSize(250, 250).stream();

// override size and image type
QRCode.from("Hello World").to(ImageType.GIF).withSize(250, 250).file();
QRCode.from("Hello World").to(ImageType.GIF).withSize(250, 250).stream();

// supply own outputstream
QRCode.from("Hello World").to(ImageType.PNG).writeTo(outputStream);
{% endhighlight %}

See the github page for more info: <http://kenglxn.github.io/QRGen/>

If you'd rather use [ZXING](http://code.google.com/p/zxing/) directly, you will be able to since it is a transitive dependency of QRGen, but you could also just add the ZXING repository definition and dependency to your project:
{% highlight xml %}
    <dependencies>
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>core</artifactId>
            <version>2.0</version>
        </dependency>
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>javase</artifactId>
            <version>2.0</version>
        </dependency>
    </dependencies>
    <repositories>
        <repository>
            <id>google-releases</id>
            <url>https://oss.sonatype.org/content/repositories/releases</url>
        </repository>
    </repositories>
{% endhighlight %}
