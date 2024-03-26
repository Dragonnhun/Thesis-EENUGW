package hu.eenugw.userprofilemanagement.entities;

import java.time.Instant;
import java.util.List;

import hu.eenugw.core.helpers.InstantConverter;
import jakarta.annotation.Nullable;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Size;
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

    @Size(max = 1000)
    private String comment;

    @Convert(converter = InstantConverter.class)
    private Instant creationDateUtc;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_profile_comment_likes",
        joinColumns = @JoinColumn(name = "user_profile_comment_id"),
        inverseJoinColumns = @JoinColumn(name = "user_profile_id"))
    private List<UserProfileEntity> userProfileLikes;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_profile_comment_hearts",
        joinColumns = @JoinColumn(name = "user_profile_comment_id"),
        inverseJoinColumns = @JoinColumn(name = "user_profile_id"))
    private List<UserProfileEntity> userProfileHearts;

    @Nullable
    @ManyToOne(
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
