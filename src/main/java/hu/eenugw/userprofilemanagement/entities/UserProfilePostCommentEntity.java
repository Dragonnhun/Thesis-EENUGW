package hu.eenugw.userprofilemanagement.entities;

import java.time.Instant;
import hu.eenugw.core.helpers.InstantConverter;
import jakarta.annotation.Nullable;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "userProfilePostComment")
@Table(name = "user_profile_post_comments")
public class UserProfilePostCommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Version
    private int version;

    @Lob
    private String comment;

    @Convert(converter = InstantConverter.class)
    public Instant creationDateUtc;

    public Integer likeCount;

    public Integer heartCount;

    @Nullable
    @OneToOne(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id")
    private UserProfileEntity userProfile;

    @Nullable
    @ManyToOne(
        targetEntity = UserProfilePostEntity.class,
        fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_post_id")
    private UserProfilePostEntity userProfilePost;
}
