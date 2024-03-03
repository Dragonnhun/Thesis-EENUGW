package hu.eenugw.userprofilemanagement.endpoints;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrEmptyOrBlank;

import java.util.List;
import java.util.Optional;

import org.springframework.data.util.Pair;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import hu.eenugw.userprofilemanagement.constants.ReactionType;
import hu.eenugw.userprofilemanagement.models.UserProfilePost;
import hu.eenugw.userprofilemanagement.services.UserProfilePostService;

@Endpoint
@AnonymousAllowed
public class UserProfilePostEndpoint {
    private final UserProfilePostService _userProfilePostService;

    public UserProfilePostEndpoint(UserProfilePostService userProfilePostService) {
        _userProfilePostService = userProfilePostService;
    }

    public Optional<UserProfilePost> getUserProfilePostByUserProfilePostId(String userProfilePostId) {
        return _userProfilePostService
            .getUserProfilePostByUserProfilePostId(userProfilePostId)
            .map(_userProfilePostService::convertUserProfilePostEntityToModel);
    }

    public List<UserProfilePost> getAllUserProfilePostsByUserProfileId(String userProfileId) {
        return _userProfilePostService
            .getAllUserProfilePostsByUserProfileId(userProfileId)
            .stream()
            .map(_userProfilePostService::convertUserProfilePostEntityToModel)
            .toList();
    }

    public List<UserProfilePost> getAllUserProfilePostsByProfileDisplayId(String profileDisplayId) {
        return _userProfilePostService
            .getAllUserProfilePostsByProfileDisplayId(profileDisplayId)
            .stream()
            .map(_userProfilePostService::convertUserProfilePostEntityToModel)
            .toList();
    }

    public List<UserProfilePost> getTimelineByUserProfileId(String userProfileId) {
        return _userProfilePostService
            .getTimelineByUserProfileId(userProfileId)
            .stream()
            .map(_userProfilePostService::convertUserProfilePostEntityToModel)
            .toList();
    }

    public Pair<Boolean, String> likeDislikePost(String userProfilePostId, String userProfileId, ReactionType reactionType) {
        return _userProfilePostService.likeDislikePost(userProfilePostId, userProfileId, reactionType);
    }

    public UserProfilePost createUserProfilePost(UserProfilePost userProfilePost) {
        if (userProfilePost == null) {
            Optional.empty();
        }

        var userProfilePostEntity = _userProfilePostService.convertUserProfilePostModelToEntity(userProfilePost);
        
        return Optional.of(_userProfilePostService.createPost(userProfilePostEntity)).map(_userProfilePostService::convertUserProfilePostEntityToModel).orElse(null);
    }
}
