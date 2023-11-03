package hu.eenugw.data.endpoints;

import hu.eenugw.data.entities.User;
import hu.eenugw.data.services.UserService;
import hu.eenugw.security.AuthenticatedUser;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Endpoint
@AnonymousAllowed
public class UserEndpoint {
    @Autowired
    private AuthenticatedUser authenticatedUser;

    private final UserService _userService;

    public UserEndpoint(UserService userService) {
        _userService = userService;
    }

    public @Nonnull List<User> listAll() { 
        return _userService.listAll();
    }

    public Optional<User> getByUsername(String username) {
        return _userService.getByUsername(username);
    }
    
    public Optional<User> getByEmail(String email) {
        return _userService.getByEmail(email);
    }

    public Optional<User> getByUsernameOrEmail(String username, String email) {
        return _userService.getByUsernameOrEmail(username, email);
    }
    
    @Transactional
    public User register(User user) throws UnsupportedEncodingException, MessagingException {
        return _userService.register(user);
    }

    @Transactional
    public Pair<HttpStatus, String> verifyRegistration(String verificationCode) {
        if (verificationCode == null) {
            return Pair.of(HttpStatus.UNPROCESSABLE_ENTITY, "Verification code is not provided.");
        }

        var result = _userService.verifyRegistration(verificationCode);

        if (result.getFirst()) {
            return Pair.of(HttpStatus.OK, result.getSecond());
        } 
        else {
            return Pair.of(HttpStatus.UNAUTHORIZED, result.getSecond());
        }
    }

    public Optional<User> getAuthenticatedUser() {
        var authenticatedUserDetails = authenticatedUser.get();

        if (!authenticatedUserDetails.isPresent()) {
            return Optional.empty();
        }

        return _userService.getByUsername(authenticatedUserDetails.get().getUsername());
    }

    @AnonymousAllowed
    public String checkUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return auth == null ? null : auth.getName();
    }
}
