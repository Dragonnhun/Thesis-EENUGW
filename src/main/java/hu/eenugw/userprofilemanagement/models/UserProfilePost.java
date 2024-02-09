package hu.eenugw.userprofilemanagement.models;

import java.time.Instant;
import java.util.List;
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
public class UserProfilePost {
    private String id;

    private int version;

    private String description;

    private String photoPath;

    private Instant creationDateUtc;

    private String userProfileId;

    private List<String> userProfilePostCommentIds;

    private List<String> userProfileLikeIds;

    private List<String> userProfileHeartIds;
}
