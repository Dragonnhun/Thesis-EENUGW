package hu.eenugw.usermanagement.services;

import static hu.eenugw.core.helpers.InstantHelpers.utcNow;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.util.Pair;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import hu.eenugw.core.services.EmailService;
import hu.eenugw.core.services.SiteService;
import hu.eenugw.usermanagement.entities.User;
import hu.eenugw.usermanagement.repositories.UserRepository;
import hu.eenugw.userprofilemanagement.entities.UserProfile;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

import static hu.eenugw.usermanagement.extensions.EmailExtensions.verificationEmail;
import static hu.eenugw.usermanagement.extensions.EmailExtensions.forgottenPasswordEmail;
import static hu.eenugw.usermanagement.extensions.EmailExtensions.passwordChangedEmail;

@Service
public class UserService {
    @Autowired
    private final UserRepository _userRepository;
    @Autowired
    private final UserProfileRepository _userProfileRepository;

    private final SiteService _siteService;
    private final EmailService _emailService;

    public UserService(
        UserRepository userRepository,
        UserProfileRepository userProfileRepository,
        EmailService emailService,
        SiteService siteService) {
        _siteService = siteService;
        _emailService = emailService;
        _userRepository = userRepository;
        _userProfileRepository = userProfileRepository;
    }

    public Optional<User> getById(Long id) {
        return _userRepository.findById(id);
    }

    public Optional<User> getByUsername(String username) {
        return _userRepository.findByUsername(username);
    }

    public Optional<User> getByEmail(String email) {
        return _userRepository.findByEmail(email);
    }

    public Optional<User> getByUsernameOrEmail(String username, String email) {
        return _userRepository.findByUsernameOrEmail(username, email);
    }

    public Optional<User> getByRegistrationToken(String registrationToken) {
        return _userRepository.findByRegistrationToken(registrationToken);
    }

    public Optional<User> getByForgottenPasswordToken(String forgottenPasswordToken) {
        return _userRepository.findByForgottenPasswordToken(forgottenPasswordToken);
    }

    @Transactional
    public User register(User user) throws UnsupportedEncodingException, MessagingException {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setEnabled(false);
        user.setRoles(new java.util.HashSet<>(java.util.Arrays.asList(hu.eenugw.usermanagement.constants.Role.USER)));
         
        var token = UUID.randomUUID().toString();
        user.setRegistrationToken(token);
        
        var userProfile = _userProfileRepository.save(new UserProfile());
        user.setUserProfile(userProfile);
        userProfile.setUser(user);

        _emailService.sendEmail(verificationEmail(user, _siteService));

        return _userRepository.save(user);
    }

    public Pair<Boolean, String> verifyRegistration(String registrationToken) {
        if (registrationToken == null || registrationToken.isEmpty()) {
            return Pair.of(false, "Registration token is not provided.");
        }

        var optionalUser = _userRepository.findByRegistrationToken(registrationToken);
         
        if (optionalUser.isEmpty()) return Pair.of(false, "User could not be found based on the provided registration token!");

        var user = optionalUser.get();
         
        user.setEnabled(true);
        user.setRegistrationToken(null);
         
        _userRepository.save(user);
         
        return Pair.of(true, "User has been successfully verified and enabled!");
    }

    @Transactional
    public Pair<Boolean, String> requestResettingForgottenPassword(String email) throws UnsupportedEncodingException, MessagingException {
        var optionalUser = _userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) return Pair.of(false, "User could not be found based on the provided E-mail Address!");

        var user = optionalUser.get();

        user.setEnabled(false);
        var token = UUID.randomUUID().toString();
        user.setForgottenPasswordToken(token);
        user.setForgottenPasswordTokenExpirationDateUtc(Optional.of(utcNow().plusSeconds(86400)));

        _userRepository.save(user);

        _emailService.sendEmail(forgottenPasswordEmail(user, _siteService));

        return Pair.of(true, "E-mail has been successfully sent!");
    }

    public Pair<Boolean, String> resetForgottenPassword(String forgottenPasswordToken, String newPassword) throws UnsupportedEncodingException, MessagingException {
        var optionalUser = _userRepository.findByForgottenPasswordToken(forgottenPasswordToken);

        if (optionalUser.isEmpty())
            return Pair.of(false, "User could not be found based on the provided forgotten password token!");

        var user = optionalUser.get();

        if (utcNow().isAfter(user.getForgottenPasswordTokenExpirationDateUtc().orElse(Instant.EPOCH)))
            return Pair.of(false, "The request to reset forgotten password has expired! Please request a new one. if you would like to change your password!");

        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        user.setForgottenPasswordToken(null);
        user.setForgottenPasswordTokenExpirationDateUtc(Optional.ofNullable(null));
        user.setEnabled(true);

        _userRepository.save(user);

        _emailService.sendEmail(passwordChangedEmail(user, _siteService));

        return Pair.of(true, "Password has been successfully reset!");
    }

    public Boolean hasForgottenPasswordResetAlreadyBeenRequestedForEmail(String email) {
        var optionalUser = _userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) return false;

        var user = optionalUser.get();

        if (user.getForgottenPasswordToken() == null || user.getForgottenPasswordToken().isEmpty())
            return false;

        return true;
    }

    public Boolean hasForgottenPasswordTokenExpiredForEmail(String email) {
        var optionalUser = _userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) return false;

        var user = optionalUser.get();

        if (user.getForgottenPasswordToken() == null || user.getForgottenPasswordToken().isEmpty())
            return false;

        if (utcNow().isBefore(user.getForgottenPasswordTokenExpirationDateUtc().orElse(Instant.EPOCH)))
            return false;

        return true;
    }

    public void delete(Long id) {
        _userRepository.deleteById(id);
    }

    public List<User> listAll() {
        return _userRepository.findAll();
    }

    public Page<User> list(Pageable pageable) {
        return _userRepository.findAll(pageable);
    }

    public Page<User> list(Pageable pageable, Specification<User> filter) {
        return _userRepository.findAll(filter, pageable);
    }

    public int count() {
        return (int) _userRepository.count();
    }
}
