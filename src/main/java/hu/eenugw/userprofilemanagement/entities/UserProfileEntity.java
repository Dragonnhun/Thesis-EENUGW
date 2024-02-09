package hu.eenugw.userprofilemanagement.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import hu.eenugw.usermanagement.entities.UserEntity;
import hu.eenugw.userprofilemanagement.constants.RelationshipStatus;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "userProfile")
@Table(name = "user_profiles")
public class UserProfileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Version
    private int version;

    @GeneratedValue(strategy = GenerationType.UUID)
    private String profileDisplayId;

    private String firstName;

    private String lastName;

    private String profilePicturePath;

    private String coverPicturePath;

    @Size(max = 1000)
    private String description;

    @Size(max = 50)
    private String city;

    @Size(max = 50)
    private String hometown;

    private RelationshipStatus relationshipStatus;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        mappedBy = "followings",
        fetch = FetchType.LAZY)
    private List<UserProfileEntity> followers;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_profile_followings", 
        joinColumns = @JoinColumn(name = "follower_user_profile_id"), 
        inverseJoinColumns = @JoinColumn(name = "followed_user_profile_id"))
    private List<UserProfileEntity> followings;

    @Nullable
    @OneToOne(
        targetEntity = UserEntity.class,
        fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Nullable
    @OneToMany(
        targetEntity = UserProfilePostEntity.class,
        mappedBy = "userProfile",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL)
    private List<UserProfilePostEntity> userProfilePosts;

    @Nullable
    @OneToMany(
        targetEntity = UserProfilePostCommentEntity.class,
        mappedBy = "userProfile",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL)
    private List<UserProfilePostCommentEntity> userProfilePostComments;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfilePostEntity.class,
        mappedBy = "userProfileLikes",
        fetch = FetchType.LAZY)
    private List<UserProfilePostEntity> likedUserProfilePosts;

    @Nullable
    @ManyToMany(
        targetEntity = UserProfilePostEntity.class,
        mappedBy = "userProfileHearts",
        fetch = FetchType.LAZY)
    private List<UserProfilePostEntity> heartedUserProfilePosts;
}
