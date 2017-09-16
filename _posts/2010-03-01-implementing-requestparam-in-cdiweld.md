---
layout: post
title: Implementing @RequestParam in CDI/WELD using Qualifier and InjectionPoint as @HttpParam
---

Implementing `RequestParam as `HttpParam is quite easy. This is the example discussed in the [Weld Reference Documentation](http://docs.jboss.org/weld/reference/1.0.1-Final/en-US/html_single/#d0e1622). What we do is set up a [Qualifier](http://docs.jboss.org/weld/reference/1.0.1-Final/en-US/html_single/#d0e1212) like this:

```java
@Qualifier
@Retention(RUNTIME)
@Target({TYPE, METHOD, FIELD, PARAMETER})
public @interface HttpParam {
    public String value() default "";
}
```

Then all we need to do is create a [Producer Method](http://docs.jboss.org/weld/reference/1.0.1-Final/en-US/html_single/#d0e942): and utilize the [InjectionPoint](http://docs.jboss.org/weld/reference/1.0.1-Final/en-US/html_single/#d0e1622) metadata to set the proper value based on either the name of the attribute or the value of the annotation. This example will ensure that both:

```java
 @Inject @HttpParam("trackId")
 String currentTrackId;
```

and

```java
 @Inject @HttpParam
 String trackId;
```

Makes the request parameter "trackId" available to the field. Example url: http://www.glxn.net/listen?trackId=16180339 will set currentTrackId in the first example above to 16180339, and in the second set trackId to the same value.

```java
public class HttpParamProducer {

    @Inject
    FacesContext facesContext;

    @Produces
    @HttpParam
    String getHttpParameter(InjectionPoint ip) {
        String name = ip.getAnnotated().getAnnotation(HttpParam.class).value();
        if ("".equals(name)) name = ip.getMember().getName();
        return facesContext.getExternalContext()
                .getRequestParameterMap()
                .get(name);
    }
}
```

Now we can access the request parameter in our [Bean](http://docs.jboss.org/weld/reference/1.0.1-Final/en-US/html_single/#bean-definition) simply by annotating the field with `Inject and `HttpParam. In the example below I am injecting the `SessionScoped bean SpotifyWeb, and calling its wrap method to enrich my request parameter "trackId" using a Producer method to create a `Named parameter "trackReqParam" available to another bean, or in my case the view. So in my view page i print out **\#{trackReqParam}** and it shows the initial request parameter trackId with some modification done in the wrap method. Just a simple example of it's application.
The key here is that you can't inject a request parameter to a session scoped bean and expect it to not live in the dependent scope of its parent. That means if you do inject it to a session scoped bean, it is injected and set once, then lives in that scope until the scope is terminated.
This enforces good design in my opinion. If you are using a session scoped bean and want values from it, it's variables and methods are readily available to a request scoped bean, so just inject it and do your work there. This ensures a slim application.

```java
@RequestScoped
public class TrackProducer {

    @Inject @HttpParam
    String trackId;

    @Inject
    SpotifyWeb spotifyWeb;

    @Produces
    @Named("trackReqParam")
    String getTrack() {
        return spotifyWeb.wrap(trackId);
    }
}
```

You may also want to look at [Injection point metadata API for Web Beans by Gavin King](http://relation.to/Bloggers/InjectionPointMetadataAPIForWebBeans)
