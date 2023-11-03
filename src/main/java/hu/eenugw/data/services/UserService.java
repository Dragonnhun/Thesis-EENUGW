package hu.eenugw.data.services;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

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

    @Transactional
    public User register(User entity) throws UnsupportedEncodingException, MessagingException {
        entity.setPassword(new BCryptPasswordEncoder().encode(entity.getPassword()));
        entity.setEnabled(false);
        entity.setRoles(new java.util.HashSet<>(java.util.Arrays.asList(hu.eenugw.data.Role.USER)));
         
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
         
        if (optionalUser.isEmpty()) return Pair.of(false, "User could not be found!");

        var user = optionalUser.get();
         
        user.setEnabled(true);
        user.setVerificationCode(null);
         
        _userRepository.save(user);
         
        return Pair.of(true, "User has been successfully verified!");
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
