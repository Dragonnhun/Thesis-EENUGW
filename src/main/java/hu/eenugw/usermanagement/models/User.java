package hu.eenugw.usermanagement.models;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import hu.eenugw.usermanagement.constants.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;

    private int version;

    @Size(min = 3, max = 255, message = "Username must be between 3 and 255 characters long.")
    private String username;

    @Email(message = "E-mail Address must be valid.")
    @Size(min = 5, max = 255, message = "E-mail Address must be between 5 and 255 characters long.")
    private String email;

    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters long.")
    private String password;

    private Boolean enabled;

    private Boolean isFirstLogin;

    private String registrationToken;

    private String forgottenPasswordToken;

    private Optional<Instant> forgottenPasswordTokenExpirationDateUtc;

    private Set<Role> roles;

    private String userProfileId;
}