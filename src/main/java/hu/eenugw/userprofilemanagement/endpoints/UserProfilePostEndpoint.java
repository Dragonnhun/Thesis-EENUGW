package hu.eenugw.userprofilemanagement.endpoints;

import java.util.List;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import hu.eenugw.userprofilemanagement.entities.UserProfilePost;
import hu.eenugw.userprofilemanagement.services.UserProfilePostService;

@Endpoint
@AnonymousAllowed
public class UserProfilePostEndpoint {
    private final UserProfilePostService userProfilePostService;

    public UserProfilePostEndpoint(UserProfilePostService userProfilePostService) {
        this.userProfilePostService = userProfilePostService;
    }

    public UserProfilePost getById(Long id) {
        return userProfilePostService.getById(id);
    }

    public List<UserProfilePost> getAllByUserProfileId(Long userProfileId) {
        return userProfilePostService.getAllByUserProfileId(userProfileId);
    }

    public List<UserProfilePost> getTimelineForUserProfileId(Long userProfileId) {
        return userProfilePostService.getTimelineForUserProfileId(userProfileId);
    }
}
