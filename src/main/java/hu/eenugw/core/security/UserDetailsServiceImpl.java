package hu.eenugw.core.security;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.eenugw.usermanagement.entities.User;
import hu.eenugw.usermanagement.exceptions.EmailNotFoundException;
import hu.eenugw.usermanagement.exceptions.UsernameNotFoundException;
import hu.eenugw.usermanagement.services.UserService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserService _userService;

    public UserDetailsServiceImpl(UserService userService) {
        _userService = userService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = _userService.getByUsername(username);

        if (!user.isPresent()) {
            throw new UsernameNotFoundException("No user present with username: " + username);
        } else {
            var loadedUser = user.get();

            return new org.springframework.security.core.userdetails.User(
                loadedUser.getUsername(), loadedUser.getPassword(), getAuthorities(loadedUser));
        }
    }

    @Transactional
    public UserDetails loadUserByEmail(String email) throws EmailNotFoundException {
        var user = _userService.getByEmail(email);

        if (!user.isPresent()) {
            throw new EmailNotFoundException("No user present with email: " + email);
        } else {
            var loadedUser = user.get();

            return new org.springframework.security.core.userdetails.User(
                loadedUser.getUsername(), loadedUser.getPassword(), getAuthorities(loadedUser));
        }
    }

    private static List<GrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList());
    }
}
