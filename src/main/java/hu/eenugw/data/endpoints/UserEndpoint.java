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
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
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

    public Optional<User> getByRegistrationToken(String registrationToken) {
        return _userService.getByRegistrationToken(registrationToken);
    }

    public Optional<User> getByForgottenPasswordToken(String forgottenPasswordToken) {
        return _userService.getByForgottenPasswordToken(forgottenPasswordToken);
    }
    
    @Transactional
    public User register(User user) throws UnsupportedEncodingException, MessagingException {
        return _userService.register(user);
    }

    @Transactional
    public Pair<String, String> verifyRegistration(String verificationCode) {
        if (verificationCode == null || verificationCode.isEmpty()) {
            return Pair.of("Error", "Verification code is not provided.");
        }

        var result = _userService.verifyRegistration(verificationCode);

        if (result.getFirst()) {
            return Pair.of("Success", result.getSecond());
        } 
        else {
            return Pair.of("Error", result.getSecond());
    @Transactional
    public Pair<String, String> requestResettingForgottenPassword(String email) throws UnsupportedEncodingException, MessagingException {
        var emailRegex = "^.+@.+\\..+$";

        if (email == null || email.isEmpty()) {
            return Pair.of("Error", "E-mail Address is not provided.");
        }

        var pattern = Pattern.compile(emailRegex);
        var matcher = pattern.matcher(email);

        if (matcher.matches()) {
            return ServiceResult(_userService.requestResettingForgottenPassword(email));
        } else {
            return Pair.of("Error", "The provided E-mail Address is not valid.");
        }
    }

    @Transactional
    public Pair<String, String> resetForgottenPassword(String forgottenPasswordToken, String newPassword) {
        if (forgottenPasswordToken == null || forgottenPasswordToken.isEmpty()) {
            return Pair.of("Error", "Forgotten password token is not provided.");
        }

        return ServiceResult(_userService.resetForgottenPassword(forgottenPasswordToken, newPassword));
    }

    public Boolean hasForgottenPasswordResetAlreadyBeenRequestedForEmail(String email) {
        if (email == null || email.isEmpty()) return false;

        return _userService.hasForgottenPasswordResetAlreadyBeenRequestedForEmail(email);
    }

    public Boolean hasForgottenPasswordTokenExpiredForEmail(String email) {
        if (email == null || email.isEmpty()) return false;

        return _userService.hasForgottenPasswordTokenExpiredForEmail(email);
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

    private Pair<String, String> ServiceResult(Pair<Boolean, String> result) {
        if (result.getFirst()) {
            return Pair.of("Success", result.getSecond());
        } 
        else {
            return Pair.of("Error", result.getSecond());
        }
    }
}
