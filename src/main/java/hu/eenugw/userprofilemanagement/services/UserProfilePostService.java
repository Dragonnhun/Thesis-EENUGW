package hu.eenugw.userprofilemanagement.services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.eenugw.userprofilemanagement.entities.UserProfilePost;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;

@Service
public class UserProfilePostService {
    @Autowired
    private final UserProfilePostRepository _userProfilePostRepository;
    @Autowired
    private final UserProfileRepository _userProfileRepository;

    public UserProfilePostService(UserProfilePostRepository userProfilePostRepository, UserProfileRepository userProfileRepository) {
        _userProfilePostRepository = userProfilePostRepository;
        _userProfileRepository = userProfileRepository;
    }

    public UserProfilePost getById(Long id) {
        var userProfilePost = _userProfilePostRepository.findById(id);

        if (userProfilePost.isEmpty()) {
            return null;
        }

        return userProfilePost.get();
    }

    public List<UserProfilePost> getAllByUserProfileId(Long userProfileId) {
        var userProfilePosts = _userProfilePostRepository.findAllByUserProfileId(userProfileId);

        if (userProfilePosts.isEmpty()) {
            return null;
        }

        return userProfilePosts.get();
    }

    public List<UserProfilePost> getTimelineForUserProfileId(Long userProfileId) {
        var userProfile = _userProfileRepository.findById(userProfileId);

        if (userProfile.isEmpty()) {
            return new ArrayList<UserProfilePost>();
        }

        var followings = userProfile.get().getFollowings();

        if (followings.isEmpty()) {
            return new ArrayList<UserProfilePost>();
        }

        var userProfilePosts = new ArrayList<UserProfilePost>();

        for (var followingUserProfile : followings) {
            var followingUserProfilePosts = followingUserProfile.getUserProfilePosts();

            if (followingUserProfilePosts.isEmpty()) {
                continue;
            }

            userProfilePosts.addAll(followingUserProfilePosts);
        }

        return userProfilePosts;
    }
}
