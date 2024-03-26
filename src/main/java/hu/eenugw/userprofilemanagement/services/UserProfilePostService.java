package hu.eenugw.userprofilemanagement.services;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrEmptyOrBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import hu.eenugw.core.helpers.InstantHelpers;
import hu.eenugw.core.helpers.UUIDHelpers;
import hu.eenugw.userprofilemanagement.constants.PostType;
import hu.eenugw.userprofilemanagement.constants.ReactionType;
import hu.eenugw.userprofilemanagement.entities.UserProfilePostEntity;
import hu.eenugw.userprofilemanagement.entities.UserProfilePostPollReactionEntity;
import hu.eenugw.userprofilemanagement.models.UserProfilePost;
import hu.eenugw.userprofilemanagement.models.UserProfilePostPollReaction;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostCommentRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostPollReactionRepository;
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
    @Autowired
    private final UserProfilePostPollReactionRepository _userProfilePostPollReactionRepository;

    public UserProfilePostService(
        UserProfilePostRepository userProfilePostRepository,
        UserProfileRepository userProfileRepository,
        UserProfilePostCommentRepository userProfilePostCommentRepository,
        UserProfilePostPollReactionRepository userProfilePostPollReactionRepository) {
        _userProfilePostRepository = userProfilePostRepository;
        _userProfileRepository = userProfileRepository;
        _userProfilePostCommentRepository = userProfilePostCommentRepository;
        _userProfilePostPollReactionRepository = userProfilePostPollReactionRepository;
    }

    public Optional<UserProfilePostEntity> getUserProfilePostByUserProfilePostId(String userProfilePostId) {
        if (isNullOrEmptyOrBlank(userProfilePostId)) {
            return Optional.empty();
        }

        return _userProfilePostRepository.findById(userProfilePostId);
    }

    public List<UserProfilePostEntity> getAllUserProfilePostsByUserProfileId(String userProfileId) {
        if (isNullOrEmptyOrBlank(userProfileId)) {
            return new ArrayList<UserProfilePostEntity>();
        }

        return _userProfilePostRepository.findAllByUserProfileId(userProfileId);
    }

    public List<UserProfilePostEntity> getAllUserProfilePostsByProfileDisplayId(String profileDisplayId) {
        if (isNullOrEmptyOrBlank(profileDisplayId)) {
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
        if (isNullOrEmptyOrBlank(userProfileId)) {
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
        if (isNullOrEmptyOrBlank(userProfilePostId) || isNullOrEmptyOrBlank(userProfileId)) {
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
        userProfilePostEntity.setCreationDateUtc(InstantHelpers.utcNow());

        return _userProfilePostRepository.save(userProfilePostEntity);
    }

    @Transactional
    public boolean deleteUserProfilePostByUserProfilePostId(String userProfilePostId) {
        if (isNullOrEmptyOrBlank(userProfilePostId)) {
            return false;
        }

        var optionalUserProfilePost = _userProfilePostRepository.findById(userProfilePostId);

        if (optionalUserProfilePost.isEmpty()) {
            return false;
        }

        _userProfilePostRepository.delete(optionalUserProfilePost.get());

        return true;
    }

    @Transactional
    public Optional<UserProfilePostPollReactionEntity> votePoll(String userProfilePostId, String userProfileId, String pollOption) {
        if (isNullOrEmptyOrBlank(userProfilePostId) || isNullOrEmptyOrBlank(userProfileId) || isNullOrEmptyOrBlank(pollOption)) {
            return Optional.empty();
        }

        var optionalUserProfilePost = _userProfilePostRepository.findById(userProfilePostId);

        if (optionalUserProfilePost.isEmpty()) {
            return Optional.empty();
        }

        var userProfilePost = optionalUserProfilePost.get();

        var optionalUserProfile = _userProfileRepository.findById(userProfileId);

        if (optionalUserProfile.isEmpty()) {
            return Optional.empty();
        }

        var userProfile = optionalUserProfile.get();

        if (userProfilePost.getPostType() != PostType.POLL && userProfilePost.getPostType() != PostType.EVENT) {
            return Optional.empty();
        }

        if (userProfilePost.getPollOptions().stream().noneMatch(option -> option.equals(pollOption))) {
            return Optional.empty();
        }

        var optionalUserProfilePostPollReaction = _userProfilePostPollReactionRepository.findByUserProfilePostIdAndUserProfileId(userProfilePostId, userProfileId);

        var postPollReaction = optionalUserProfilePostPollReaction.orElseGet(() -> {
            var newReaction = UserProfilePostPollReactionEntity.builder()
                .userProfilePost(userProfilePost)
                .userProfile(userProfile)
                .build();

            _userProfilePostPollReactionRepository.save(newReaction);

            return newReaction;
        });

        postPollReaction.setReaction(pollOption);

        _userProfilePostPollReactionRepository.save(postPollReaction);

        if (!userProfilePost.getUserProfilePostPollReactions().contains(postPollReaction)) {
            userProfilePost.getUserProfilePostPollReactions().add(postPollReaction);

            _userProfilePostRepository.save(userProfilePost);
        }

        return Optional.of(postPollReaction);
    }

    public Optional<UserProfilePostPollReactionEntity> getUserProfilePostPollReactionByUserProfilePostPollReactionId(String userProfilePostPollReactionId) {
        if (isNullOrEmptyOrBlank(userProfilePostPollReactionId)) {
            return Optional.empty();
        }

        return _userProfilePostPollReactionRepository.findById(userProfilePostPollReactionId);
    }

    public Optional<UserProfilePostPollReactionEntity> getUserProfilePostPollReactionByUserProfilePostIdAndUserProfileId(String userProfilePostId, String userProfileId) {
        if (isNullOrEmptyOrBlank(userProfilePostId) || isNullOrEmptyOrBlank(userProfileId)) {
            return Optional.empty();
        }

        return _userProfilePostPollReactionRepository.findByUserProfilePostIdAndUserProfileId(userProfilePostId, userProfileId);
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

        var userProfilePostPollReactionIds = Optional.ofNullable(userProfilePostEntity.getUserProfilePostPollReactions()).isEmpty()
            ? new ArrayList<String>()
            : userProfilePostEntity.getUserProfilePostPollReactions().stream().map(reaction -> reaction.getId()).toList();

        return new UserProfilePost (
            userProfilePostEntity.getId(),
            userProfilePostEntity.getVersion(),
            userProfilePostEntity.getDescription(),
            userProfilePostEntity.getPhotoPath(),
            userProfilePostEntity.getCreationDateUtc(),
            userProfilePostEntity.getPostType(),
            userProfilePostEntity.getPollOptions(),
            userProfilePostEntity.getUserProfile() == null ? UUIDHelpers.DEFAULT_UUID : userProfilePostEntity.getUserProfile().getId(),
            userProfilePostCommentIds,
            userProfileLikeIds,
            userProfileHeartIds,
            userProfilePostPollReactionIds
        );
    }

    public UserProfilePostEntity convertUserProfilePostModelToEntity(UserProfilePost userProfilePost) {
        return UserProfilePostEntity.builder()
            .id(userProfilePost.getId())
            .version(userProfilePost.getVersion())
            .description(userProfilePost.getDescription())
            .photoPath(userProfilePost.getPhotoPath())
            .creationDateUtc(userProfilePost.getCreationDateUtc())
            .postType(userProfilePost.getPostType())
            .pollOptions(userProfilePost.getPollOptions())
            .userProfile(_userProfileRepository.findById(userProfilePost.getUserProfileId()).orElse(null))
            .userProfilePostComments(_userProfilePostCommentRepository.findAllById(userProfilePost.getUserProfilePostCommentIds()))
            .userProfileLikes(_userProfileRepository.findAllById(userProfilePost.getUserProfileLikeIds()))
            .userProfileHearts(_userProfileRepository.findAllById(userProfilePost.getUserProfileHeartIds()))
            .userProfilePostPollReactions(_userProfilePostPollReactionRepository.findAllById(userProfilePost.getUserProfilePostPollReactionIds()))
            .build();
    }

    public UserProfilePostPollReaction convertUserProfilePostPollReactionEntityToModel(UserProfilePostPollReactionEntity userProfilePostPollReactionEntity) {
        return new UserProfilePostPollReaction(
            userProfilePostPollReactionEntity.getId(),
            userProfilePostPollReactionEntity.getVersion(),
            userProfilePostPollReactionEntity.getUserProfile() == null ? UUIDHelpers.DEFAULT_UUID : userProfilePostPollReactionEntity.getUserProfile().getId(),
            userProfilePostPollReactionEntity.getUserProfilePost() == null ? UUIDHelpers.DEFAULT_UUID : userProfilePostPollReactionEntity.getUserProfilePost().getId(),
            userProfilePostPollReactionEntity.getReaction()
        );
    }

    public UserProfilePostPollReactionEntity convertUserProfilePostPollReactionModelToEntity(UserProfilePostPollReaction userProfilePostPollReaction) {
        return UserProfilePostPollReactionEntity.builder()
            .id(userProfilePostPollReaction.getId())
            .version(userProfilePostPollReaction.getVersion())
            .userProfilePost(_userProfilePostRepository.findById(userProfilePostPollReaction.getUserProfilePostId()).orElse(null))
            .userProfile(_userProfileRepository.findById(userProfilePostPollReaction.getUserProfileId()).orElse(null))
            .reaction(userProfilePostPollReaction.getReaction())
            .build();
    }
}
