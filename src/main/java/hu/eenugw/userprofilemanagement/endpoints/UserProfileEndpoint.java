package hu.eenugw.userprofilemanagement.endpoints;

import java.util.List;
import java.util.Optional;

import org.springframework.data.util.Pair;

import dev.hilla.Endpoint;
import hu.eenugw.userprofilemanagement.models.UserProfile;
import hu.eenugw.userprofilemanagement.services.UserProfileService;
import jakarta.annotation.security.RolesAllowed;

@Endpoint
@RolesAllowed("ROLE_USER")
public class UserProfileEndpoint {
    private final UserProfileService _userProfileService;

    public UserProfileEndpoint(UserProfileService userProfileService) {
        _userProfileService = userProfileService;
    }

    public Optional<UserProfile> getUserProfileById(String userProfileId) {
        if (userProfileId == null) {
            return Optional.empty();
        }

        return _userProfileService
            .getUserProfileById(userProfileId)
            .map(_userProfileService::convertUserProfileEntityToModel);
    }

    public Optional<UserProfile> getUserProfileByUserId(String userId) {
        if (userId == null) {
            return Optional.empty();
        }

        return _userProfileService
            .getUserProfileByUserId(userId)
            .map(_userProfileService::convertUserProfileEntityToModel);
    }

    public Optional<UserProfile> getUserProfileByProfileDisplayId(String profileDisplayId) {
        if (profileDisplayId == null) {
            return Optional.empty();
        }

        return _userProfileService
            .getUserProfileByProfileDisplayId(profileDisplayId)
            .map(_userProfileService::convertUserProfileEntityToModel);
    }

    public List<UserProfile> getUserProfileFollowersById(String id) {
        return _userProfileService
            .getUserProfileFollowersById(id)
            .stream()
            .map(_userProfileService::convertUserProfileEntityToModel)
            .toList();
    }

    public Pair<Boolean, String> followUnfollowUserProfile(String followerUserProfileId, String followedUserProfileId) {
        return _userProfileService.followUnfollowUserProfile(followerUserProfileId, followedUserProfileId);
    }
}
