package hu.eenugw.core.security;

import com.vaadin.flow.spring.security.VaadinWebSecurity;

import hu.eenugw.core.constants.RouteUrls;

import java.util.Base64;
import javax.crypto.spec.SecretKeySpec;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends VaadinWebSecurity {
    @Value("${AUTH_SECRET}")
    private String authSecret;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private DataSource dataSource;

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .jdbcAuthentication()
            .passwordEncoder(new BCryptPasswordEncoder())
            .dataSource(dataSource)
            .usersByUsernameQuery("SELECT username, password, enabled FROM users WHERE username = ?")
            .authoritiesByUsernameQuery("SELECT username, roles FROM users INNER JOIN user_roles ON users.id = user_roles.user_id WHERE username = ?");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Allowing requests without authentication.
        // http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/assets/**")).permitAll());
        // http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/assets/images/profile-pictures/*.jpg")).permitAll());
        // http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/assets/images/profile-pictures/*.png")).permitAll());
        http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/images/*.png")).permitAll());
        http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/line-awesome/**/*.svg")).permitAll());
        http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/register")).permitAll());
        http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/forgotten-password")).permitAll());
        http.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/reset-forgotten-password")).permitAll());
        
        super.configure(http);

        http.sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        setLoginView(http, RouteUrls.LOGIN, RouteUrls.HOME);
        setStatelessAuthentication(
            http, new SecretKeySpec(Base64.getDecoder().decode(authSecret), JwsAlgorithms.HS256), "hu.eenugw");
    }
}
