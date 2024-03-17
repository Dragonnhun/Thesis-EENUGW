package hu.eenugw.usermanagement.services;

import static hu.eenugw.core.helpers.InstantHelpers.utcNow;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.util.HashSet;
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

import com.sanctionco.jmail.JMail;

import hu.eenugw.core.helpers.UUIDHelpers;
import hu.eenugw.core.services.EmailService;
import hu.eenugw.core.services.SiteService;
import hu.eenugw.usermanagement.entities.UserEntity;
import hu.eenugw.usermanagement.models.User;
import hu.eenugw.usermanagement.repositories.UserRepository;
import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;
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

    public Optional<UserEntity> getUserEntityById(String id) {
        return _userRepository.findById(id);
    }

    public Optional<UserEntity> getUserEntityByUsername(String username) {
        return _userRepository.findByUsername(username);
    }

    public Optional<UserEntity> getUserEntityByEmail(String email) {
        return _userRepository.findByEmail(email);
    }

    public Optional<UserEntity> getUserEntityByUsernameOrEmail(String username, String email) {
        return _userRepository.findByUsernameOrEmail(username, email);
    }

    public Optional<UserEntity> getUserEntityByRegistrationToken(String registrationToken) {
        return _userRepository.findByRegistrationToken(registrationToken);
    }

    public Optional<UserEntity> getUserEntityByForgottenPasswordToken(String forgottenPasswordToken) {
        return _userRepository.findByForgottenPasswordToken(forgottenPasswordToken);
    }

    @Transactional
    public UserEntity registerUserEntity(UserEntity userEntity) throws UnsupportedEncodingException, MessagingException {
        userEntity.setPassword(new BCryptPasswordEncoder().encode(userEntity.getPassword()));
        userEntity.setEnabled(false);
        userEntity.setForgottenPasswordToken(null);
        userEntity.setRoles(new java.util.HashSet<>(java.util.Arrays.asList(hu.eenugw.usermanagement.constants.Role.USER)));
        userEntity.setIsFirstLogin(true);

        var registrationToken = UUID.randomUUID().toString();
        userEntity.setRegistrationToken(registrationToken);

        userEntity = _userRepository.save(userEntity);

        var userProfileEntity = new UserProfileEntity();
        userProfileEntity.setProfileDisplayId(UUID.randomUUID().toString());
        userProfileEntity.setUser(userEntity);

        _userProfileRepository.save(userProfileEntity);

        userEntity.setUserProfile(userProfileEntity);
        _userRepository.save(userEntity);

        _emailService.sendEmail(verificationEmail(userEntity, _siteService));

        return userEntity;
    }

    public Pair<Boolean, String> verifyRegistration(String registrationToken) {
        if (registrationToken == null || registrationToken.isEmpty()) {
            return Pair.of(false, "Registration token is not provided.");
        }

        var optionalUserEntity = _userRepository.findByRegistrationToken(registrationToken);
         
        if (optionalUserEntity.isEmpty()) return Pair.of(false, "User could not be found based on the provided registration token!");

        var userEntity = optionalUserEntity.get();
         
        userEntity.setEnabled(true);
        userEntity.setRegistrationToken(null);
         
        _userRepository.save(userEntity);
         
        return Pair.of(true, "User has been successfully verified and enabled!");
    }

    @Transactional
    public Pair<Boolean, String> requestResettingForgottenPassword(String email) throws UnsupportedEncodingException, MessagingException {
        if (email == null || email.isEmpty()) {
            return Pair.of(false, "E-mail Address is not provided.");
        }

        if (JMail.isInvalid(email)) {
            return Pair.of(false, "The provided E-mail Address is not valid.");
        }

        var optionalUserEntity = _userRepository.findByEmail(email);

        if (optionalUserEntity.isEmpty()) return Pair.of(false, "User could not be found based on the provided E-mail Address!");

        var userEntity = optionalUserEntity.get();

        userEntity.setEnabled(false);
        var forgottenPasswordToken = UUID.randomUUID().toString();
        userEntity.setForgottenPasswordToken(forgottenPasswordToken);
        // Adding a day in seconds.
        userEntity.setForgottenPasswordTokenExpirationDateUtc(Optional.of(utcNow().plusSeconds(86400)));

        _userRepository.save(userEntity);

        _emailService.sendEmail(forgottenPasswordEmail(userEntity, _siteService));

        return Pair.of(true, "E-mail has been successfully sent!");
    }

    public Pair<Boolean, String> resetForgottenPassword(String forgottenPasswordToken, String newPassword) throws UnsupportedEncodingException, MessagingException {
        if (forgottenPasswordToken == null || forgottenPasswordToken.isEmpty()) {
            return Pair.of(false, "Forgotten password token is not provided.");
        }

        if (newPassword == null || newPassword.isEmpty()) {
            return Pair.of(false, "New password is not provided.");
        }
        
        var optionalUserEntity = _userRepository.findByForgottenPasswordToken(forgottenPasswordToken);

        if (optionalUserEntity.isEmpty())
            return Pair.of(false, "User could not be found based on the provided forgotten password token!");

        var userEntity = optionalUserEntity.get();

        if (utcNow().isAfter(userEntity.getForgottenPasswordTokenExpirationDateUtc().orElse(Instant.EPOCH)))
            return Pair.of(false, "The request to reset forgotten password has expired! Please request a new one, if you would like to change your password!");

        userEntity.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userEntity.setForgottenPasswordToken(null);
        userEntity.setForgottenPasswordTokenExpirationDateUtc(Optional.ofNullable(null));
        userEntity.setEnabled(true);

        _userRepository.save(userEntity);

        _emailService.sendEmail(passwordChangedEmail(userEntity, _siteService));

        return Pair.of(true, "Password has been successfully reset!");
    }

    @Transactional
    public UserEntity updateUserEntity(UserEntity userEntity) {
        return _userRepository.save(userEntity);
    }

    public Boolean hasForgottenPasswordResetAlreadyBeenRequestedForEmail(String email) {
        if (email == null || email.isEmpty()) return false;

        if (JMail.isInvalid(email)) return false;

        var optionalUserEntity = _userRepository.findByEmail(email);

        if (optionalUserEntity.isEmpty()) return false;

        var userEntity = optionalUserEntity.get();

        return !(userEntity.getForgottenPasswordToken() == null || userEntity.getForgottenPasswordToken().isEmpty());
    }

    public Boolean hasForgottenPasswordTokenExpiredForEmail(String email) {
        if (email == null || email.isEmpty()) return false;

        if (JMail.isInvalid(email)) return false;

        var optionalUserEntity = _userRepository.findByEmail(email);

        if (optionalUserEntity.isEmpty()) return false;

        var userEntity = optionalUserEntity.get();

        return !(userEntity.getForgottenPasswordToken() == null || userEntity.getForgottenPasswordToken().isEmpty())
            && utcNow().isAfter(userEntity.getForgottenPasswordTokenExpirationDateUtc().orElse(Instant.EPOCH));
    }

    public void delete(String id) {
        _userRepository.deleteById(id);
    }

    public List<UserEntity> listAll() {
        return _userRepository.findAll();
    }

    public Page<UserEntity> list(Pageable pageable) {
        return _userRepository.findAll(pageable);
    }

    public Page<UserEntity> list(Pageable pageable, Specification<UserEntity> filter) {
        return _userRepository.findAll(filter, pageable);
    }

    public int count() {
        return (int) _userRepository.count();
    }

    public User convertUserEntityToModel(UserEntity userEntity) {
        return new User (
            userEntity.getId(),
            userEntity.getVersion(),
            userEntity.getUsername(),
            userEntity.getEmail(),
            userEntity.getPassword(),
            userEntity.getEnabled(),
            userEntity.getIsFirstLogin(),
            userEntity.getRegistrationToken(),
            userEntity.getForgottenPasswordToken(),
            userEntity.getForgottenPasswordTokenExpirationDateUtc(),
            new HashSet<>(userEntity.getRoles()),
            userEntity.getUserProfile() == null ? UUIDHelpers.DEFAULT_UUID : userEntity.getUserProfile().getId()
        );
    }

    public UserEntity convertUserModelToEntity(User user) {
        return UserEntity.builder()
            .id(user.getId())
            .version(user.getVersion())
            .username(user.getUsername())
            .email(user.getEmail())
            .password(user.getPassword())
            .enabled(user.getEnabled())
            .isFirstLogin(user.getIsFirstLogin())
            .registrationToken(user.getRegistrationToken())
            .forgottenPasswordToken(user.getForgottenPasswordToken())
            .forgottenPasswordTokenExpirationDateUtc(user.getForgottenPasswordTokenExpirationDateUtc())
            .roles(new HashSet<>(user.getRoles()))
            .userProfile(_userProfileRepository.findById(user.getUserProfileId()).orElse(null))
            .build();
    }
}
