package hu.eenugw.usermanagement.exceptions;

import org.springframework.security.core.AuthenticationException;

public class UserNotFoundException extends AuthenticationException {
    public UserNotFoundException(String msg) {
        super(msg);
    }
}
