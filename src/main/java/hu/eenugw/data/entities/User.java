package hu.eenugw.data.entities;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import hu.eenugw.data.constants.Role;
import hu.eenugw.data.helpers.InstantConverter;

@Entity
@Table(name = "users")
public class User extends AbstractEntity {
    @Nonnull
    @Size(min = 3, max = 255, message = "Username must be between 3 and 255 characters long.")
    private String username;

    @Nonnull
    @Email(message = "E-mail Address must be valid.")
    @Size(min = 5, max = 255, message = "E-mail Address must be between 5 and 255 characters long.")
    private String email;

    @Nonnull
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters long.")
    private String password;

    @Nonnull
    private Boolean enabled;

    private String registrationToken;

    private String forgottenPasswordToken;

    @Convert(converter = InstantConverter.class)
    private Optional<Instant> forgottenPasswordTokenExpirationDate;

    @Nonnull
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Role> roles;

    private Integer profileId;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getRegistrationToken() {
        return registrationToken;
    }

    public void setRegistrationToken(String registrationToken) {
        this.registrationToken = registrationToken;
    }

    public String getForgottenPasswordToken() {
        return forgottenPasswordToken;
    }

    public void setForgottenPasswordToken(String forgottenPasswordToken) {
        this.forgottenPasswordToken = forgottenPasswordToken;
    }

    public Optional<Instant> getForgottenPasswordTokenExpirationDate() {
        return forgottenPasswordTokenExpirationDate;
    }

    public void setForgottenPasswordTokenExpirationDate(Optional<Instant> forgottenPasswordTokenExpirationDate) {
        this.forgottenPasswordTokenExpirationDate = forgottenPasswordTokenExpirationDate;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }
}
