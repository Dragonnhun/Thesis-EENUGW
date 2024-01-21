package hu.eenugw.userprofilemanagement.entities;

import java.time.Instant;

import hu.eenugw.core.entities.AbstractEntity;
import hu.eenugw.core.helpers.InstantConverter;
import jakarta.annotation.Nullable;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "userprofilepostcomments")
// @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class UserProfileComment extends AbstractEntity {
    @Lob
    private String comment;

    @Convert(converter = InstantConverter.class)
    public Instant creationDateUtc;

    public Integer likeCount;

    public Integer heartCount;

    @Nullable
    @OneToOne(
        targetEntity = UserProfile.class,
        fetch = FetchType.EAGER)
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;

    @Nullable
    @ManyToOne(
        targetEntity = UserProfilePost.class,
        fetch = FetchType.EAGER)
    @JoinColumn(name = "user_profile_post_id")
    private UserProfilePost userProfilePost;
}
