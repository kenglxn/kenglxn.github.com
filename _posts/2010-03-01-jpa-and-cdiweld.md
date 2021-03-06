---
layout: post
title: Simple CDI/WELD login example
---

![](http://www.gliffy.com/pubdoc/2016929/L.jpg):http://www.gliffy.com/pubdoc/2016929/L.jpg

**View**

```html
<h:form id="spotifylogin" class="loginform spotifyform">
    <h2>Spotify login</h2>
    <p>Please log in to your spotify account</p>

    <h:outputLabel for="spotifyusername" value="Username:"></h:outputLabel>
    <h:inputText id="spotifyusername" value="#{spotiWelder.username}"></h:inputText>
    <h:message for="spotifyusername" errorClass="invalid"></h:message>

    <h:outputLabel for="spotifypassword" value="Password:"></h:outputLabel>
    <h:inputSecret id="spotifypassword" value="#{spotiWelder.password}"></h:inputSecret>
    <h:message for="spotifypassword" errorClass="invalid"></h:message>

    <h:commandButton id="login" action="#{spotifyWeb.login}" value="Log in!"></h:commandButton>
</h:form>
```

**Entity**

```java
@Entity
public class SpotiWelder implements Serializable {

    private static final long serialVersionUID = -6625241632523446019L;

    private Long id;

    private String username;

    private String password;

    public SpotiWelder() {
    }

    @Id
    @GeneratedValue
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    @NotEmpty
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @NotNull
    @NotEmpty
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

**Action Bean**

```java
@SessionScoped
@Named
public class SpotifyWeb implements Serializable {

    private static final long serialVersionUID = -352191768337315102L;

    private Logger log;

    SpotiWelder spotiWelder = new SpotiWelder();

    @Inject
    FacesContext facesContext;

    public SpotifyWeb() {
        this.log = Logger.getLogger(this.getClass().getSimpleName());
        connection = new SpotiWeldConnection();
    }

    @PostConstruct
    public void initialize() {
        log.info(this.getClass().getSimpleName() + " was constructed");
    }

    public void login() {
        connection.login(spotiWelder.getUsername(), spotiWelder.getPassword());

        log.info("succesful login for " + loggedInUser);
        facesContext.addMessage(null, new FacesMessage("Welcome " + loggedInUser.getName()));
    }

    @Produces @Named
    public SpotiWelder getSpotiWelder() {
        return spotiWelder;
    }
}
```

-   Remember to add an empty constructor to your entity when using via `Producer methods. If not you might get the dreaded "java.lang.IllegalArgumentException: Object: foo is not a known entity type."
    * Remeber to add `GeneratedValue to @Id field on Entity.

**Related:**
<http://seamframework.org/Community/JPAEntityIsUnknownWhenUsingTheModelAnnotation>
<http://www.seamframework.org/Community/ErrorWhenUsingSessionScopedAndEntityAnnotation>
