package hu.eenugw.userprofilemanagement.models;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import dev.hilla.Nullable;
import hu.eenugw.userprofilemanagement.constants.RelationshipStatus;
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

    private String firstName;

    private String lastName;

    private String profilePicturePath;
    
    private String coverPicturePath;

    @Size(max = 1000)
    @Nullable
    private String description;

    @Size(max = 50)
    @Nullable
    private String city;

    @Size(max = 50)
    @Nullable
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

    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }
}
