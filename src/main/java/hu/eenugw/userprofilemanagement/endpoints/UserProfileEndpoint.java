package hu.eenugw.userprofilemanagement.endpoints;

import java.util.Optional;

import dev.hilla.Endpoint;
import hu.eenugw.userprofilemanagement.entities.UserProfile;
import hu.eenugw.userprofilemanagement.services.UserProfileService;

@Endpoint
public class UserProfileEndpoint {
    private final UserProfileService _userProfileService;

    public UserProfileEndpoint(UserProfileService userProfileService) {
        _userProfileService = userProfileService;
    }

    public Optional<UserProfile> getById(Long id) {
        return _userProfileService.getById(id);
    }
}
