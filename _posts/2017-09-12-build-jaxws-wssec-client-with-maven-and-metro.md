---
layout: post
title: Building an executable WS client using maven and metro
---

Recently I was forced to integrate with a WS Security enabled endpoint using [Secure Conversations](http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/ws-secureconversation-1.3-os.html).
The project in question was written in Ruby and Javascript, but after spending a couple of days trying to integrate
with the WebService I had to throw in the towel. I spent some time using [Savon](https://github.com/savonrb/savon) and [Signer](https://github.com/ebeigarts/signer/)
combined with my own implementation of p\_sha1, but that is food for a whole nother blog post.

After accepting defeat and deciding to create a client with [Metro](https://javaee.github.io/metro/) I looked for some writeups. Most I found were dated, or not a good fit.
There are probably several good posts on this, but I could not seem to find them. So I started from scratch, using the [Metro docs](https://javaee.github.io/metro/doc/user-guide/ch02.html#using-metro-in-a-maven-project)

What follows is a step by step for creating an executable jar with bundled metro dependencies that will be able to communicate with a [WSIT](https://docs.oracle.com/cd/E17802_01/webservices/webservices/reference/tutorials/wsit/doc/index.html) endpoint.

### Step 1

Create new project using maven quickstart archetype:

```bash
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

### Step 2

Add Metro dependency:

```xml
<dependency>
  <groupId>org.glassfish.metro</groupId>
  <artifactId>webservices-rt</artifactId>
  <version>2.3.1</version>
</dependency>
```

### Step 3

Download wsdl and place it in src/main/resources/wsdl and wsimport via jaxws-maven-plugin:
Make note of the extension=true configuration option. Without this some classes may be skipped if
they are found to be non standard. Also note the options to fetch external DTD and schema. In my case
the wsdl has external references, and without these options the client code is a mismatch.

```xml
<plugins>
  <plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>jaxws-maven-plugin</artifactId>
      <version>2.5</version>
      <dependencies>
          <dependency>
              <groupId>org.glassfish.metro</groupId>
              <artifactId>webservices-tools</artifactId>
              <version>2.3.1</version>
          </dependency>
          <dependency>
              <groupId>org.glassfish.metro</groupId>
              <artifactId>webservices-rt</artifactId>
              <version>2.3.1</version>
          </dependency>
      </dependencies>
      <executions>
          <execution>
              <goals>
                  <goal>wsimport</goal>
              </goals>
              <configuration>
                  <vmArgs>
                    <vmArg>-Djavax.xml.accessExternalDTD=all</vmArg>
                    <vmArg>-Djavax.xml.accessExternalSchema=all</vmArg>
                  </vmArgs>
                  <xadditionalHeaders>true</xadditionalHeaders>
                  <extension>true</extension>
                  <wsdlDirectory>${project.basedir}/src/main/resources/wsdl</wsdlDirectory>
                  <wsdlFiles>
                      <wsdlFile>TheService.wsdl</wsdlFile>
                  </wsdlFiles>
                  <wsdlLocation>/wsdl/TheService.wsdl</wsdlLocation>
              </configuration>
          </execution>
      </executions>
  </plugin>
  ...
</plugins>
```

### Step 4

At this point we can create the main client class, and setup authentication and endpoint address:
In my case I want to consume stdin, but you could also pass a file as argument or even the payload itself.
Using stdin is a nice way to separate payload from options to the program among other things.

```java
public class WsClient {
    private static final String SERVICE_ENDPOINT_TEMPLATE = "https://%s/WS/TheService";

    private final String hostname;
    private final String username;
    private final String password;

    public static void main(String[] args) throws IOException {
        createClient().call();
    }

    public WsClient(String hostname, String username, String password) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
    }

    private void call() throws IOException {
        String input = readStdIn();

        TheService ws = getTheService();

        final TheRequest theRequest = new TheRequest();
        theRequest.setFileByteStream(input.getBytes());

        final TheResponse result = ws.upload(theRequest);
        System.out.println("result:" + result.whatever());
    }

    private TheService getTheService() {
        TheService ws = new TheService_Service().getWSHttpBindingTheService();
        Map<String, Object> requestContext = ((BindingProvider) ws).getRequestContext();
        requestContext.put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, getEndpointAddress());
        requestContext.put(BindingProvider.USERNAME_PROPERTY, this.username);
        requestContext.put(BindingProvider.PASSWORD_PROPERTY, this.password);
        return ws;
    }

    private String getEndpointAddress() {
        return String.format(SERVICE_ENDPOINT_TEMPLATE, this.hostname);
    }

    private static WsClient createClient() throws IOException {
        Properties properties = new Properties(System.getProperties());
        properties.load(new FileInputStream("client.properties"));
        System.setProperties(properties);

        return new WsClient(
                System.getProperty("hostname"),
                System.getProperty("username"),
                System.getProperty("password")
        );
    }

    private String readStdIn() throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        }
    }
}
```

### Step 5

Now we can create the executable jar. I want the dependencies to be a part of the jar itself. We could also use
a lib directory outside the jar ([as I describe here](http://glxn.net/2010/08/17/making-a-swing-project-using-intellij-idea-and-gui-builder-with-maven-including-executable-jar)),
but for this use case I prefer to bundle the dependencies inside the client jar file.

Configure the maven-assembly-plugin to build a single distributable jar:

```xml
<plugins>
  <finalName>${project.artifactId}-nodeps</finalName>
  ...

  <plugin>
    <artifactId>maven-assembly-plugin</artifactId>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <finalName>${project.artifactId}</finalName>
        <appendAssemblyId>false</appendAssemblyId>
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>com.mycompany.app.WsClient</mainClass>
            </manifest>
        </archive>
    </configuration>
  </plugin>
</plugins>
```

### Step 6, run it

With this we now have the executable jar \`${project.artifactId}.jar\`.

Example usage:

```bash
cat somepayload.xml | java -jar the-client.jar
```
