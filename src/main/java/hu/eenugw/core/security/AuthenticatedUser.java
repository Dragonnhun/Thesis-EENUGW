package hu.eenugw.core.security;

import com.vaadin.flow.spring.security.AuthenticationContext;

import hu.eenugw.usermanagement.models.User;
import hu.eenugw.usermanagement.repositories.UserRepository;
import hu.eenugw.usermanagement.services.UserService;
import java.util.Optional;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthenticatedUser {
    private final AuthenticationContext _authenticationContext;
    private final UserRepository _userRepository;
    private final UserService _userService;

    public AuthenticatedUser(
        AuthenticationContext authenticationContext,
        UserRepository userRepository,
        UserService userService) {
        _authenticationContext = authenticationContext;
        _userRepository = userRepository;
        _userService = userService;
    }

    @Transactional
    public Optional<User> get() {
        return _authenticationContext
            .getAuthenticatedUser(Jwt.class)
            .map(userDetails -> _userRepository.findByUsername(userDetails.getSubject()).map(_userService::convertUserEntityToModel).get());
    }

    public void logout() {
        _authenticationContext.logout();
    }
}
