package hu.eenugw.usermanagement.entities;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import hu.eenugw.core.entities.AbstractEntity;
import hu.eenugw.core.helpers.InstantOptionalConverter;
import hu.eenugw.usermanagement.constants.Role;
import hu.eenugw.userprofilemanagement.entities.UserProfile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @Convert(converter = InstantOptionalConverter.class)
    private Optional<Instant> forgottenPasswordTokenExpirationDateUtc;

    @Nonnull
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Role> roles;

    @Nullable
    @OneToOne(
        targetEntity = UserProfile.class,
        mappedBy = "user",
        fetch = FetchType.EAGER,
        cascade = CascadeType.ALL)
    private UserProfile userProfile;
}
