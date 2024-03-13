package hu.eenugw.usermanagement.endpoints;

import hu.eenugw.core.security.AuthenticatedUser;
import hu.eenugw.usermanagement.models.User;
import hu.eenugw.usermanagement.services.UserService;
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

    public Optional<User> getUserById(String id) {
        return _userService.getUserEntityById(id).map(_userService::convertUserEntityToModel);
    }

    public Optional<User> getUserByUsername(String username) {
        return _userService.getUserEntityByUsername(username).map(_userService::convertUserEntityToModel);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return _userService.getUserEntityByEmail(email).map(_userService::convertUserEntityToModel);
    }

    public Optional<User> getUserByUsernameOrEmail(String username, String email) {
        return _userService.getUserEntityByUsernameOrEmail(username, email).map(_userService::convertUserEntityToModel);
    }

    public Optional<User> getUserByRegistrationToken(String registrationToken) {
        return _userService.getUserEntityByRegistrationToken(registrationToken).map(_userService::convertUserEntityToModel);
    }

    public Optional<User> getUserByForgottenPasswordToken(String forgottenPasswordToken) {
        return _userService.getUserEntityByForgottenPasswordToken(forgottenPasswordToken).map(_userService::convertUserEntityToModel);
    }
    
    @Transactional
    public Optional<User> registerUser(User user) throws UnsupportedEncodingException, MessagingException {
        if (user == null) {
            return null;
        }

        var userEntity = _userService.convertUserModelToEntity(user);

        return Optional.ofNullable(_userService.registerUserEntity(userEntity)).map(_userService::convertUserEntityToModel);
    }

    @Transactional
    public Pair<String, String> verifyRegistration(String registrationToken) {
        return ServiceResult(_userService.verifyRegistration(registrationToken));
    }

    @Transactional
    public Pair<String, String> requestResettingForgottenPassword(String email) throws UnsupportedEncodingException, MessagingException {
        return ServiceResult(_userService.requestResettingForgottenPassword(email));
    }

    @Transactional
    public Pair<String, String> resetForgottenPassword(String forgottenPasswordToken, String newPassword) throws UnsupportedEncodingException, MessagingException {
        return ServiceResult(_userService.resetForgottenPassword(forgottenPasswordToken, newPassword));
    }

    @Transactional
    public Optional<User> updateUser(User user) {
        if (user == null) {
            return null;
        }

        var userEntity = _userService.convertUserModelToEntity(user);

        return Optional.ofNullable(_userService.updateUserEntity(userEntity)).map(_userService::convertUserEntityToModel);
    }

    public Boolean hasForgottenPasswordResetAlreadyBeenRequestedForEmail(String email) {
        return _userService.hasForgottenPasswordResetAlreadyBeenRequestedForEmail(email);
    }

    public Boolean hasForgottenPasswordTokenExpiredForEmail(String email) {
        return _userService.hasForgottenPasswordTokenExpiredForEmail(email);
    }

    public @Nonnull List<User> listAll() { 
        return _userService.listAll().stream().map(_userService::convertUserEntityToModel).toList();
    }

    public Optional<User> getAuthenticatedUser() {
        return authenticatedUser.get();
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
