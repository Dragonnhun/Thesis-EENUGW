package hu.eenugw.core.security;

import com.vaadin.flow.spring.security.AuthenticationContext;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthenticatedUser {
    private final AuthenticationContext _authenticationContext;

    @Autowired
    private UserDetailsServiceImpl customUserDetailsService;

    public AuthenticatedUser(AuthenticationContext authenticationContext) {
        _authenticationContext = authenticationContext;
    }

    @Transactional
    public Optional<UserDetails> get() {
        return _authenticationContext
            .getAuthenticatedUser(Jwt.class)
            .map(userDetails -> customUserDetailsService.loadUserByUsername(userDetails.getSubject()));
    }

    public void logout() {
        _authenticationContext.logout();
    }
}
