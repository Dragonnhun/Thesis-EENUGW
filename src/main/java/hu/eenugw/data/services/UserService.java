package hu.eenugw.data.services;

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

import net.bytebuddy.utility.RandomString;

import hu.eenugw.data.entities.User;
import hu.eenugw.site.services.SiteService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class UserService {
    private final SiteService _siteService;
    private final EmailService _emailService;
    @Autowired
    private final UserRepository _userRepository;

    public UserService(UserRepository userRepository, SiteService siteService, EmailService emailService) {
        _siteService = siteService;
        _emailService = emailService;
        _userRepository = userRepository;
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
    public User register(User entity) throws UnsupportedEncodingException, MessagingException {
        entity.setPassword(new BCryptPasswordEncoder().encode(entity.getPassword()));
        entity.setEnabled(false);
        entity.setRoles(new java.util.HashSet<>(java.util.Arrays.asList(hu.eenugw.data.constants.Role.USER)));
         
        var randomCode = RandomString.make(64);
        entity.setVerificationCode(randomCode);
         
        _emailService.sendVerificationEmail(entity, _siteService.getSiteUrl());

        return _userRepository.save(entity);
    }

    public Pair<Boolean, String> verifyRegistration(String verificationCode) {
        if (verificationCode == null || verificationCode.isEmpty()) {
            return Pair.of(false, "Verification code is not provided.");
        }

        var optionalUser = _userRepository.findByVerificationCode(verificationCode);
         
        if (optionalUser.isEmpty()) return Pair.of(false, "User could not be found based on the provided verification code!");

        var user = optionalUser.get();
         
        user.setEnabled(true);
        user.setVerificationCode(null);
         
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
        user.setForgottenPasswordTokenExpirationDate(Instant.now().plusSeconds(86400));

        _userRepository.save(user);

        _emailService.sendForgottenPasswordEmail(user, _siteService.getSiteUrl());

        return Pair.of(true, "E-mail has been successfully sent!");
    }

    public Pair<Boolean, String> resetForgottenPassword(String forgottenPasswordToken, String newPassword) {
        var optionalUser = _userRepository.findByForgottenPasswordToken(forgottenPasswordToken);

        if (optionalUser.isEmpty())
            return Pair.of(false, "User could not be found based on the provided forgotten password token!");

        var user = optionalUser.get();

        if (Instant.now().isAfter(user.getForgottenPasswordTokenExpirationDate()))
            return Pair.of(false, "The request to reset forgotten password has expired! Please request a new one. if you would like to change your password!");

        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        user.setForgottenPasswordToken(null);
        user.setEnabled(true);

        _userRepository.save(user);

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

        if (Instant.now().isBefore(user.getForgottenPasswordTokenExpirationDate()))
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
