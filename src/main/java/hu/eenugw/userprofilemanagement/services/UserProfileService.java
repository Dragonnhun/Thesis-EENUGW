package hu.eenugw.userprofilemanagement.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import hu.eenugw.core.helpers.UUIDHelpers;
import hu.eenugw.usermanagement.repositories.UserRepository;
import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;
import hu.eenugw.userprofilemanagement.models.UserProfile;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostCommentRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;
import jakarta.transaction.Transactional;

@Service
public class UserProfileService {
    @Autowired
    private final UserRepository _userRepository;
    @Autowired
    private final UserProfileRepository _userProfileRepository;
    @Autowired
    private final UserProfilePostRepository _userProfilePostRepository;
    @Autowired
    private final UserProfilePostCommentRepository _userProfilePostCommentRepository;

    public UserProfileService(
        UserRepository userRepository,
        UserProfileRepository userProfileRepository,
        UserProfilePostRepository userProfilePostRepository,
        UserProfilePostCommentRepository userProfilePostCommentRepository) {
        _userRepository = userRepository;
        _userProfileRepository = userProfileRepository;
        _userProfilePostRepository = userProfilePostRepository;
        _userProfilePostCommentRepository = userProfilePostCommentRepository;
    }

    public Optional<UserProfileEntity> getUserProfileById(String id) {
        if (id == null) {
            return Optional.empty();
        }

        return _userProfileRepository.findById(id);
    }

    public Optional<UserProfileEntity> getUserProfileByUserId(String userId) {
        if (userId == null) {
            return Optional.empty();
        }

        return _userProfileRepository.findByUserId(userId);
    }

    public Optional<UserProfileEntity> getUserProfileByProfileDisplayId(String profileDisplayId) {
        if (profileDisplayId == null) {
            return Optional.empty();
        }

        return _userProfileRepository.findByProfileDisplayId(profileDisplayId);
    }

    public List<UserProfileEntity> getUserProfileFollowersById(String id) {
        if (id == null) {
            return List.of();
        }

        var userProfileEntity = _userProfileRepository.findById(id);

        if (userProfileEntity.isEmpty()) {
            return List.of();
        }

        return userProfileEntity.get().getFollowers();
    }

    public List<UserProfileEntity> getUserProfileFollowingsById(String id) {
        if (id == null) {
            return List.of();
        }

        var userProfileEntity = _userProfileRepository.findById(id);

        if (userProfileEntity.isEmpty()) {
            return List.of();
        }

        return userProfileEntity.get().getFollowings();
    }

    @Transactional
    public Pair<Boolean, String> followUnfollowUserProfile(String followerUserProfileId, String followedUserProfileId) {
        if (followerUserProfileId == null || followerUserProfileId.isBlank() || followedUserProfileId == null || followedUserProfileId.isBlank()) {
            return Pair.of(false, "Follower User ID or Followed User ID is not provided.");
        }

        var optionalFollowerUserProfile = _userProfileRepository.findById(followerUserProfileId);

        if (optionalFollowerUserProfile.isEmpty()) {
            return Pair.of(false, "Follower User Profile not found.");
        }

        var followerUserProfile = optionalFollowerUserProfile.get();

        var optionalFollowedUserProfile = _userProfileRepository.findById(followedUserProfileId);

        if (optionalFollowedUserProfile.isEmpty()) {
            return Pair.of(false, "Followed User Profile not found.");
        }

        var followedUserProfile = optionalFollowedUserProfile.get();

        if (followerUserProfile.getFollowings().contains(followedUserProfile)) {
            followerUserProfile.getFollowings().remove(followedUserProfile);
            followedUserProfile.getFollowers().remove(followerUserProfile);
        } else {
            followerUserProfile.getFollowings().add(followedUserProfile);
            followedUserProfile.getFollowers().add(followerUserProfile);
        }

        _userProfileRepository.save(followerUserProfile);
        _userProfileRepository.save(followedUserProfile);

        return Pair.of(true, "Success");
    }

    public UserProfile convertUserProfileEntityToModel(UserProfileEntity userProfileEntity) {
        var followerUserProfileIds = Optional.ofNullable(userProfileEntity.getFollowers()).isEmpty()
            ? new ArrayList<String>()
            : userProfileEntity.getFollowers().stream().map(profile -> profile.getId()).toList();

        var followingUserProfileIds = Optional.ofNullable(userProfileEntity.getFollowings()).isEmpty()
            ? new ArrayList<String>()
            : userProfileEntity.getFollowings().stream().map(profile -> profile.getId()).toList();

        var userProfilePostIds = Optional.ofNullable(userProfileEntity.getUserProfilePosts()).isEmpty()
            ? new ArrayList<String>()
            : userProfileEntity.getUserProfilePosts().stream().map(post -> post.getId()).toList();

        var userProfilePostCommentIds = Optional.ofNullable(userProfileEntity.getUserProfilePostComments()).isEmpty()
            ? new ArrayList<String>()
            : userProfileEntity.getUserProfilePostComments().stream().map(comment -> comment.getId()).toList();

        var likedUserProfilePostIds = Optional.ofNullable(userProfileEntity.getLikedUserProfilePosts()).isEmpty()
            ? new ArrayList<String>()
            : userProfileEntity.getLikedUserProfilePosts().stream().map(likedPost -> likedPost.getId()).toList();

        var heartedUserProfilePostIds = Optional.ofNullable(userProfileEntity.getHeartedUserProfilePosts()).isEmpty()
            ? new ArrayList<String>()
            : userProfileEntity.getHeartedUserProfilePosts().stream().map(heartedPost -> heartedPost.getId()).toList();

        return new UserProfile (
            userProfileEntity.getId(),
            userProfileEntity.getVersion(),
            userProfileEntity.getProfileDisplayId(),
            userProfileEntity.getFirstName(),
            userProfileEntity.getLastName(),
            userProfileEntity.getProfilePicturePath(),
            userProfileEntity.getCoverPicturePath(),
            userProfileEntity.getDescription(),
            userProfileEntity.getCity(),
            userProfileEntity.getHometown(),
            userProfileEntity.getRelationshipStatus(),
            followerUserProfileIds,
            followingUserProfileIds,
            userProfileEntity.getUser() == null ? UUIDHelpers.DEFAULT_UUID : userProfileEntity.getUser().getId(),
            userProfilePostIds,
            userProfilePostCommentIds,
            likedUserProfilePostIds,
            heartedUserProfilePostIds
        );
    }

    public UserProfileEntity convertUserProfileModelToEntity(UserProfile userProfile) {
        return UserProfileEntity.builder()
            .id(userProfile.getId())
            .version(userProfile.getVersion())
            .profileDisplayId(userProfile.getProfileDisplayId())
            .firstName(userProfile.getFirstName())
            .lastName(userProfile.getLastName())
            .profilePicturePath(userProfile.getProfilePicturePath())
            .coverPicturePath(userProfile.getCoverPicturePath())
            .description(userProfile.getDescription())
            .city(userProfile.getCity())
            .hometown(userProfile.getHometown())
            .relationshipStatus(userProfile.getRelationshipStatus())
            .followers(userProfile.getFollowerIds().stream().map(followerId -> _userProfileRepository.findById(followerId).orElse(null)).filter(profile -> profile != null).toList())
            .followings(userProfile.getFollowingIds().stream().map(followingId -> _userProfileRepository.findById(followingId).orElse(null)).filter(profile -> profile != null).toList())
            .user(_userRepository.findById(userProfile.getUserId()).orElse(null))
            .userProfilePosts(userProfile.getUserProfilePostIds().stream().map(postId -> _userProfilePostRepository.findById(postId).orElse(null)).filter(post -> post != null).toList())
            .userProfilePostComments(userProfile.getUserProfilePostCommentIds().stream().map(commentId -> _userProfilePostCommentRepository.findById(commentId).orElse(null)).filter(comment -> comment != null).toList())
            .likedUserProfilePosts(userProfile.getLikedUserProfilePostIds().stream().map(likedPostId -> _userProfilePostRepository.findById(likedPostId).orElse(null)).filter(likedPost -> likedPost != null).toList())
            .heartedUserProfilePosts(userProfile.getHeartedUserProfilePostIds().stream().map(heartedPostId -> _userProfilePostRepository.findById(heartedPostId).orElse(null)).filter(heartedPost -> heartedPost != null).toList())
            .build();
    }
}
