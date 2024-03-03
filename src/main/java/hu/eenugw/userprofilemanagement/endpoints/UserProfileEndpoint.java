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

    public Optional<UserProfile> getUserProfileByUserProfileId(String userProfileId) {
        return _userProfileService
            .getUserProfileByUserProfileId(userProfileId)
            .map(_userProfileService::convertUserProfileEntityToModel);
    }

    public Optional<UserProfile> getUserProfileByUserId(String userId) {
        return _userProfileService
            .getUserProfileByUserId(userId)
            .map(_userProfileService::convertUserProfileEntityToModel);
    }

    public Optional<UserProfile> getUserProfileByProfileDisplayId(String profileDisplayId) {
        return _userProfileService
            .getUserProfileByProfileDisplayId(profileDisplayId)
            .map(_userProfileService::convertUserProfileEntityToModel);
    }

    public List<UserProfile> getUserProfileFollowersByUserProfileId(String userProfileId) {
        return _userProfileService
            .getUserProfileFollowersByUserProfileId(userProfileId)
            .stream()
            .map(_userProfileService::convertUserProfileEntityToModel)
            .toList();
    }

    public List<UserProfile> getUserProfileFollowingsByUserProfileId(String userProfileId) {
        return _userProfileService
            .getUserProfileFollowingsByUserProfileId(userProfileId)
            .stream()
            .map(_userProfileService::convertUserProfileEntityToModel)
            .toList();
    }

    public Pair<Boolean, String> followUnfollowUserProfile(String followerUserProfileId, String followedUserProfileId) {
        return _userProfileService.followUnfollowUserProfile(followerUserProfileId, followedUserProfileId);
    }

    public List<UserProfile> searchUserProfilesByName(String name) {
        return _userProfileService
            .searchUserProfilesByName(name)
            .stream()
            .map(_userProfileService::convertUserProfileEntityToModel)
            .toList();
    }
}
