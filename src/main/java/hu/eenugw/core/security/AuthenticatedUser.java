package hu.eenugw.core.security;

import com.vaadin.flow.spring.security.AuthenticationContext;

import hu.eenugw.usermanagement.entities.User;
import hu.eenugw.usermanagement.repositories.UserRepository;

import java.util.Optional;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthenticatedUser {
    private final AuthenticationContext _authenticationContext;
    private final UserRepository _userRepository;

    // @Autowired
    // private UserDetailsServiceImpl customUserDetailsService;

    public AuthenticatedUser(AuthenticationContext authenticationContext, UserRepository userRepository) {
        _authenticationContext = authenticationContext;
        _userRepository = userRepository;
    }

    // @Transactional
    // public Optional<UserDetails> get() {
    //     return _authenticationContext
    //         .getAuthenticatedUser(Jwt.class)
    //         .map(userDetails -> customUserDetailsService.loadUserByUsername(userDetails.getSubject()));
    // }

    @Transactional
    public Optional<User> get() {
        return _authenticationContext
            .getAuthenticatedUser(Jwt.class)
            .map(userDetails -> _userRepository.findByUsername(userDetails.getSubject()).get());
    }

    public void logout() {
        _authenticationContext.logout();
    }
}
