package hu.eenugw.userprofilemanagement.entities;

import java.time.Instant;
import java.util.List;

import hu.eenugw.core.entities.AbstractEntity;
import hu.eenugw.core.helpers.InstantConverter;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userprofileposts")
// @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class UserProfilePost extends AbstractEntity {
    @Lob
    public String description;

    public String photoPath;

    @Convert(converter = InstantConverter.class)
    public Instant creationDateUtc;

    public Integer likeCount;

    public Integer heartCount;

    @Nullable
    @ManyToOne(
        targetEntity = UserProfile.class,
        fetch = FetchType.EAGER)
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;

    @Nullable
    @OneToMany(
        targetEntity = UserProfileComment.class,    
        mappedBy = "userProfilePost",
        fetch = FetchType.EAGER,
        cascade = CascadeType.ALL)
    private List<UserProfileComment> userProfileComments;
}
