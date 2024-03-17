package hu.eenugw.userprofilemanagement.models;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import dev.hilla.Nonnull;
import dev.hilla.Nullable;
import hu.eenugw.userprofilemanagement.constants.RelationshipStatus;
import jakarta.validation.constraints.NotBlank;
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
public class UserProfile {
    private String id;

    private int version;

    private String profileDisplayId;

    @Nonnull
    @NotBlank
    private String firstName;

    @Nonnull
    @NotBlank
    private String lastName;

    @Nonnull
    private String fullName;

    @Nonnull
    private String profilePicturePath;
    
    @Nonnull
    private String coverPicturePath;

    @Size(max = 1000)
    @Nonnull
    @NotBlank
    private String description;

    @Size(max = 50)
    @Nonnull
    @NotBlank
    private String city;

    @Size(max = 50)
    @Nonnull
    @NotBlank
    private String hometown;

    @Nullable
    private RelationshipStatus relationshipStatus;

    @Nullable
    private Optional<Instant> birthDateUtc;

    private List<String> followerIds;

    private List<String> followingIds;

    private String userId;

    private List<String> userProfilePostIds;

    private List<String> userProfilePostCommentIds;

    private List<String> likedUserProfilePostIds;

    private List<String> heartedUserProfilePostIds;
}
