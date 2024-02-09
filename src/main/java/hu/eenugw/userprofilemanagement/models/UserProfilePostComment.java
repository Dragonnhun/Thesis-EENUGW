package hu.eenugw.userprofilemanagement.models;

import java.time.Instant;
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
public class UserProfilePostComment {
    private String id;

    private int version;

    private String comment;

    private Instant creationDateUtc;

    private Integer likeCount;
    
    private Integer heartCount;

    private String userProfileId;

    private String userProfilePostId;
}
