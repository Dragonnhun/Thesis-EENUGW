package hu.eenugw.userprofilemanagement.entities;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import hu.eenugw.core.entities.AbstractEntity;
import hu.eenugw.usermanagement.entities.User;
import hu.eenugw.userprofilemanagement.constants.RelationshipStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userprofiles")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class UserProfile extends AbstractEntity {
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

    @Nonnull
    @ManyToMany(
        targetEntity = UserProfile.class,
        mappedBy = "followings",
        fetch = FetchType.EAGER)
    private List<UserProfile> followers;

    @Nonnull
    @ManyToMany(
        targetEntity = UserProfile.class,
        fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_followings", 
        joinColumns = @JoinColumn(name = "user_profile_id"), 
        inverseJoinColumns = @JoinColumn(name = "following_user_profile_id"))
    private List<UserProfile> followings;

    @OneToOne(
        targetEntity = User.class,
        fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Nullable
    @OneToMany(
        targetEntity = UserProfilePost.class,
        mappedBy = "userProfile",
        fetch = FetchType.EAGER,
        cascade = CascadeType.ALL)
    private List<UserProfilePost> userProfilePosts;

    @Nullable
    @OneToMany(
        targetEntity = UserProfileComment.class,
        mappedBy = "userProfile",
        fetch = FetchType.EAGER,
        cascade = CascadeType.ALL)
    private List<UserProfileComment> userProfileComments;
}
