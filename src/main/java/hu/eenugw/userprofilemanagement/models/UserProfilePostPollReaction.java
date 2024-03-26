package hu.eenugw.userprofilemanagement.models;

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
public class UserProfilePostPollReaction {
    private String id;

    private int version;

    private String userProfilePostId;

    private String userProfileId;
    
    private String reaction;
}
