package hu.eenugw.userprofilemanagement.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import hu.eenugw.core.helpers.InstantHelpers;
import hu.eenugw.core.helpers.UUIDHelpers;
import hu.eenugw.userprofilemanagement.constants.ReactionType;
import hu.eenugw.userprofilemanagement.entities.UserProfilePostEntity;
import hu.eenugw.userprofilemanagement.models.UserProfilePost;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostCommentRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;
import jakarta.transaction.Transactional;

@Service
public class UserProfilePostService {
    @Autowired
    private final UserProfilePostRepository _userProfilePostRepository;
    @Autowired
    private final UserProfileRepository _userProfileRepository;
    @Autowired
    private final UserProfilePostCommentRepository _userProfilePostCommentRepository;

    public UserProfilePostService(
        UserProfilePostRepository userProfilePostRepository,
        UserProfileRepository userProfileRepository,
        UserProfilePostCommentRepository userProfilePostCommentRepository) {
        _userProfilePostRepository = userProfilePostRepository;
        _userProfileRepository = userProfileRepository;
        _userProfilePostCommentRepository = userProfilePostCommentRepository;
    }

    public Optional<UserProfilePostEntity> getById(String id) {
        if (id == null) {
            return Optional.empty();
        }

        return _userProfilePostRepository.findById(id);
    }

    public List<UserProfilePostEntity> getAllByUserProfileId(String userProfileId) {
        if (userProfileId == null) {
            return new ArrayList<UserProfilePostEntity>();
        }

        return _userProfilePostRepository.findAllByUserProfileId(userProfileId);
    }

    public List<UserProfilePostEntity> getAllByUserProfileDisplayId(String profileDisplayId) {
        if (profileDisplayId == null) {
            return new ArrayList<UserProfilePostEntity>();
        }

        var optionalUserProfile = _userProfileRepository.findByProfileDisplayId(profileDisplayId);

        if (optionalUserProfile.isEmpty()) {
            return new ArrayList<UserProfilePostEntity>();
        }

        var userProfile = optionalUserProfile.get();

        return _userProfilePostRepository.findAllByUserProfileId(userProfile.getId());
    }

    public List<UserProfilePostEntity> getTimelineByUserProfileId(String userProfileId) {
        if (userProfileId == null) {
            return new ArrayList<UserProfilePostEntity>();
        }

        var optionalUserProfile = _userProfileRepository.findById(userProfileId);

        if (optionalUserProfile.isEmpty()) {
            return new ArrayList<UserProfilePostEntity>();
        }

        var followings = optionalUserProfile.get().getFollowings();

        if (followings.isEmpty()) {
            return new ArrayList<UserProfilePostEntity>();
        }

        var userProfilePosts = new ArrayList<UserProfilePostEntity>();

        for (var followingUserProfile : followings) {
            var followingUserProfilePosts = followingUserProfile.getUserProfilePosts();

            if (followingUserProfilePosts.isEmpty()) {
                continue;
            }

            userProfilePosts.addAll(followingUserProfilePosts);
        }

        return userProfilePosts;
    }

    @Transactional
    public Pair<Boolean, String> likeDislikePost(String userProfilePostId, String userProfileId, ReactionType reactionType) {
        if (userProfilePostId == null || userProfileId == null) {
            return Pair.of(false, "Post ID or User ID is not provided.");
        }

        var optionalUserProfilePost = _userProfilePostRepository.findById(userProfilePostId);

        if (optionalUserProfilePost.isEmpty()) {
            return Pair.of(false, "Post not found.");
        }

        var userProfilePost = optionalUserProfilePost.get();

        var optionalUserProfile = _userProfileRepository.findById(userProfileId);

        if (optionalUserProfile.isEmpty()) {
            return Pair.of(false, "User not found.");
        }

        var userProfile = optionalUserProfile.get();

        switch (reactionType) {
            case LIKE:
                if (userProfilePost.getUserProfileLikes().contains(userProfile)) {
                    userProfilePost.getUserProfileLikes().remove(userProfile);
                } else if (userProfilePost.getUserProfileHearts().contains(userProfile)) {
                    userProfilePost.getUserProfileHearts().remove(userProfile);
                    userProfilePost.getUserProfileLikes().add(userProfile); 
                }
                else {
                    userProfilePost.getUserProfileLikes().add(userProfile);
                }
                break;
            case HEART:
                if (userProfilePost.getUserProfileHearts().contains(userProfile)) {
                    userProfilePost.getUserProfileHearts().remove(userProfile);
                } else if (userProfilePost.getUserProfileLikes().contains(userProfile)) {
                    userProfilePost.getUserProfileLikes().remove(userProfile);
                    userProfilePost.getUserProfileHearts().add(userProfile);
                }
                else {
                    userProfilePost.getUserProfileHearts().add(userProfile);
                }
                break;
            default:
                return Pair.of(false, "Invalid reaction type.");
        }

        _userProfilePostRepository.save(userProfilePost);

        return Pair.of(true, "Success");
    }

    @Transactional
    public UserProfilePostEntity createPost(UserProfilePostEntity userProfilePostEntity) {
        userProfilePostEntity.creationDateUtc = InstantHelpers.utcNow();

        return _userProfilePostRepository.save(userProfilePostEntity);
    }

    public UserProfilePost convertUserProfilePostEntityToModel(UserProfilePostEntity userProfilePostEntity) {
        var userProfilePostCommentIds = Optional.ofNullable(userProfilePostEntity.getUserProfilePostComments()).isEmpty()
            ? new ArrayList<String>()
            : userProfilePostEntity.getUserProfilePostComments().stream().map(comment -> comment.getId()).toList();

        var userProfileLikeIds = Optional.ofNullable(userProfilePostEntity.getUserProfileLikes()).isEmpty()
            ? new ArrayList<String>()
            : userProfilePostEntity.getUserProfileLikes().stream().map(profile -> profile.getId()).toList();

        var userProfileHeartIds = Optional.ofNullable(userProfilePostEntity.getUserProfileHearts()).isEmpty()
            ? new ArrayList<String>()
            : userProfilePostEntity.getUserProfileHearts().stream().map(profile -> profile.getId()).toList();

        return new UserProfilePost (
            userProfilePostEntity.getId(),
            userProfilePostEntity.getVersion(),
            userProfilePostEntity.getDescription(),
            userProfilePostEntity.getPhotoPath(),
            userProfilePostEntity.getCreationDateUtc(),
            userProfilePostEntity.getUserProfile() == null ? UUIDHelpers.DEFAULT_UUID : userProfilePostEntity.getUserProfile().getId(),
            userProfilePostCommentIds,
            userProfileLikeIds,
            userProfileHeartIds
        );
    }

    public UserProfilePostEntity convertUserProfilePostModelToEntity(UserProfilePost userProfilePost) {
        return UserProfilePostEntity.builder()
            .id(userProfilePost.getId())
            .version(userProfilePost.getVersion())
            .description(userProfilePost.getDescription())
            .photoPath(userProfilePost.getPhotoPath())
            .creationDateUtc(userProfilePost.getCreationDateUtc())
            .userProfile(_userProfileRepository.findById(userProfilePost.getUserProfileId()).orElse(null))
            .userProfilePostComments(userProfilePost.getUserProfilePostCommentIds().stream().map(postCommentId -> _userProfilePostCommentRepository.findById(postCommentId).orElse(null)).filter(comment -> comment != null).toList())
            .userProfileLikes(userProfilePost.getUserProfileLikeIds().stream().map(profileId -> _userProfileRepository.findById(profileId).orElse(null)).filter(profile -> profile != null).toList())
            .userProfileHearts(userProfilePost.getUserProfileHeartIds().stream().map(profileId -> _userProfileRepository.findById(profileId).orElse(null)).filter(profile -> profile != null).toList())
            .build();
    }
}
