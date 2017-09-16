---
layout: post
title: Using Arquillian to test against a remote jboss container from within IDEA
---

I recently got introduced to [Arquillian](http://community.jboss.org/docs/DOC-14376?uniqueTitle=false). Arquillian is a JBoss project for providing better testing to the java ee stack.
Arquillian utilizes [ShrinkWrap](http://community.jboss.org/docs/DOC-14138), another great project, for creating virtual archives as deployments to the container.
It's all pretty damn slick :)
I encourage you to take a dive into the community. It's well organized and alive.

In this post I'm going to look at running Arquillian against jboss as 6 remotely from within Intellij IDEA.

First off I have generated a project using the [minimal Java EE Weld archetype](http://seamframework.org/Documentation/WeldQuickstartForMavenUsers). The Weld Archvetype will in the near future have support for generating the Arquillian part of the project as well.

To get the project into IDEA is really simple, just choose 'open project' and select the pom of the generated maven project.
IDEA will then take a couple of minutes setting things up.

For Arquillian magic to work, we need to add junit (or you could use testng if you prefer), and the arquillian dependency to the pom.

```xml
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>4.8.1</version>
	<scope>test</scope>
</dependency>

<dependency>
	<groupId>org.jboss.arquillian</groupId>
	<artifactId>arquillian-junit</artifactId>
	<version>1.0.0-SNAPSHOT</version>
	<scope>test</scope>
</dependency>
```

Then we add a profile to the pom for running the tests against the remote jboss container.

```xml
<profiles>
	<profile>
		<id>jbossas-remote-60</id>
		<dependencies>
			<dependency>
				<groupId>org.jboss.arquillian.container</groupId>
				<artifactId>arquillian-jbossas-remote-60</artifactId>
				<version>1.0.0-SNAPSHOT</version>
				<scope>test</scope>
			</dependency>
		</dependencies>
	</profile>
</profiles>
```

Notice that I have set the scope on the profile to test.
The reason for this is that i use IDEA to deploy the project to the server (not maven), and I don't want to toggle the profile in maven plugin all the time.
If the profile is activated when you do a redeploy, then IDEA will(rightfully so) think you want these dependencies deployed as part of the project and deployment will fail.

So, let's have some fun.

For my test case I have created a very simple Bean:

```java
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

@RequestScoped
@Named
public class HelloAction {

    private String input;
    private String output;

    public void say() {
        output = "You said: " + input;
		System.out.println(output);
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}
```

I want to deploy this bean to the container, and test it. The Following test case does the trick:

```java
import org.jboss.arquillian.api.Deployment;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ArchivePaths;
import org.jboss.shrinkwrap.api.Archives;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.jboss.shrinkwrap.impl.base.asset.ByteArrayAsset;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;

@RunWith(org.jboss.arquillian.junit.Arquillian.class)
public class HelloTestCase {
   @Deployment
   public static Archive<?> createDeployment() {
            JavaArchive archive = Archives.create("test.jar", JavaArchive.class)
                 .addClasses(HelloAction.class)
                 .addManifestResource(new ByteArrayAsset("<beans></beans>".getBytes()),
                                 ArchivePaths.create("beans.xml"));

            return archive;
   }

   @Inject
   HelloAction helloAction;


   @Test
   public void helloBeanShouldSayHello() {
       helloAction.setInput("hello");
       helloAction.say();
       Assert.assertEquals("You said: hello", helloAction.getOutput());
   }
}
```

The @Deployment method describes the virtual archive I want deployed to the container.
Here I create a simple archive and add the class I want to test.
For CDI beans to work you will have to add the beans.xml to the archive.

We also need to add jndi.properties file to the project. This is needed for Arquillian to be able to connect to the remote container. Make sure that **java.naming.provider.url** reflects the IP of your remote server instance.
Place jndi.properties file under src/test/resources:

```java
java.naming.factory.initial=org.jnp.interfaces.NamingContextFactory
java.naming.factory.url.pkgs=org.jboss.naming:org.jnp.interfaces
java.naming.provider.url=jnp://localhost:1099
```

Now we simply run the test from within IDEA using **right click &gt; run test**, or **ctrl+shift+f10**.
Just remember that this is a test running against a remote jboss container, so jboss needs to be running ;)

We see the test runs green:

![](/attachments/arquillian-greentestrun.png)

And that the server has the expected output in the log:

![](/attachments/arquillian-serverlog.png)

Just for kicks, let's break the test by changing the input to [yo]()

![](/attachments/arquillian-redtestrun.png)

**TIP:** If you want to debug your test, you have to remember that your code is running in the remote container. Running the test in debug mode will not work. You will have to start the container in debug mode to do this.

See the [Arquillian FAQ](http://community.jboss.org/en/arquillian/faq) page for more tips.
