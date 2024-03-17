package hu.eenugw.core.security;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.eenugw.usermanagement.entities.UserEntity;
import hu.eenugw.usermanagement.exceptions.EmailNotFoundException;
import hu.eenugw.usermanagement.exceptions.UsernameNotFoundException;
import hu.eenugw.usermanagement.services.UserService;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserService _userService;

    public CustomUserDetailsService(UserService userService) {
        _userService = userService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var optionalUserEntity = _userService.getUserEntityByUsername(username);

        if (!optionalUserEntity.isPresent()) {
            throw new UsernameNotFoundException("No user present with username: " + username);
        } else {
            var userEntity = optionalUserEntity.get();

            return new org.springframework.security.core.userdetails.User(
                userEntity.getUsername(), userEntity.getPassword(), getAuthorities(userEntity));
        }
    }

    @Transactional
    public UserDetails loadUserByEmail(String email) throws EmailNotFoundException {
        var optionalUserEntity = _userService.getUserEntityByEmail(email);

        if (!optionalUserEntity.isPresent()) {
            throw new EmailNotFoundException("No user present with email: " + email);
        } else {
            var userEntity = optionalUserEntity.get();

            return new org.springframework.security.core.userdetails.User(
                userEntity.getUsername(), userEntity.getPassword(), getAuthorities(userEntity));
        }
    }

    private static List<GrantedAuthority> getAuthorities(UserEntity userEntity) {
        return userEntity.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList());
    }
}
