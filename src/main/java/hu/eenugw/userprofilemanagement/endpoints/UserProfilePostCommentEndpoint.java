package hu.eenugw.userprofilemanagement.endpoints;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrEmptyOrBlank;

import java.util.List;
import java.util.Optional;

import org.springframework.data.util.Pair;

import dev.hilla.Endpoint;
import hu.eenugw.userprofilemanagement.constants.ReactionType;
import hu.eenugw.userprofilemanagement.models.UserProfile;
import hu.eenugw.userprofilemanagement.models.UserProfilePostComment;
import hu.eenugw.userprofilemanagement.services.UserProfilePostCommentService;
import hu.eenugw.userprofilemanagement.services.UserProfileService;
import jakarta.annotation.security.RolesAllowed;

@Endpoint
@RolesAllowed("ROLE_USER")
public class UserProfilePostCommentEndpoint {
    private final UserProfileService _userProfileService;
    private final UserProfilePostCommentService _userProfilePostCommentService;

    public UserProfilePostCommentEndpoint(
        UserProfileService userProfileService,
        UserProfilePostCommentService userProfilePostCommentService) {
        _userProfileService = userProfileService;
        _userProfilePostCommentService = userProfilePostCommentService;
    }

    public List<UserProfilePostComment> getUserProfilePostCommentsByUserProfilePostId(String userProfilePostId) {
        return _userProfilePostCommentService
            .getUserProfilePostCommentsByUserProfilePostId(userProfilePostId)
            .stream()
            .map(_userProfilePostCommentService::convertUserProfilePostCommentEntityToModel)
            .toList();
    }

    public List<Pair<UserProfile, UserProfilePostComment>> getUserProfilesAndUserProfilePostCommentsByUserProfilePostId(String userProfilePostId) {
        return _userProfilePostCommentService
            .getUserProfilesAndUserProfilePostCommentsByUserProfilePostId(userProfilePostId)
            .stream()
            .map(pair ->
                Pair.of(
                    _userProfileService.convertUserProfileEntityToModel(pair.getFirst()),
                    _userProfilePostCommentService.convertUserProfilePostCommentEntityToModel(pair.getSecond())))
            .toList();
    }

    public Pair<Boolean, String> likeDislikeComment(String userProfileCommentId, String userProfileId, ReactionType reactionType) {
        return _userProfilePostCommentService.likeDislikeComment(userProfileCommentId, userProfileId, reactionType);
    }

    public UserProfilePostComment createUserProfilePostComment(UserProfilePostComment userProfilePostComment) {
        if (userProfilePostComment == null) {
            return null;
        }

        var userProfilePostCommentEntity = _userProfilePostCommentService.convertUserProfilePostCommentModelToEntity(userProfilePostComment);

        return Optional.of(_userProfilePostCommentService.createComment(userProfilePostCommentEntity))
            .map(_userProfilePostCommentService::convertUserProfilePostCommentEntityToModel)
            .orElse(null);
    }

    public boolean deleteUserProfilePostCommentByUserProfilePostCommentId(String userProfilePostCommentId) {
        if (isNullOrEmptyOrBlank(userProfilePostCommentId)) {
            Optional.empty();
        }

        return _userProfilePostCommentService.deleteUserProfilePostCommentByUserProfilePostCommentId(userProfilePostCommentId);
    }
}
