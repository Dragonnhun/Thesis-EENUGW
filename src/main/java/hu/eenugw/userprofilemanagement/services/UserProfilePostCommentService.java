package hu.eenugw.userprofilemanagement.services;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import hu.eenugw.core.helpers.InstantHelpers;
import hu.eenugw.core.helpers.UUIDHelpers;
import hu.eenugw.userprofilemanagement.constants.ReactionType;
import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;
import hu.eenugw.userprofilemanagement.entities.UserProfilePostCommentEntity;
import hu.eenugw.userprofilemanagement.models.UserProfilePostComment;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostCommentRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfilePostRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;
import jakarta.transaction.Transactional;

@Service
public class UserProfilePostCommentService {
    private final UserProfileRepository _userProfileRepository;
    private final UserProfilePostRepository _userProfilePostRepository;
    private final UserProfilePostCommentRepository _userProfilePostCommentRepository;

    public UserProfilePostCommentService(
        UserProfileRepository userProfileRepository,
        UserProfilePostRepository userProfilePostRepository,
        UserProfilePostCommentRepository userProfilePostCommentRepository) {
        _userProfileRepository = userProfileRepository;
        _userProfilePostRepository = userProfilePostRepository;
        _userProfilePostCommentRepository = userProfilePostCommentRepository;
    }

    public List<UserProfilePostCommentEntity> getUserProfilePostCommentsByUserProfilePostId(String userProfilePostId) {
        if (isNullOrBlank(userProfilePostId)) {
            return List.of();
        }

        return _userProfilePostCommentRepository.findAllByUserProfilePostId(userProfilePostId);
    }

    public List<Pair<UserProfileEntity, UserProfilePostCommentEntity>> getUserProfilesAndUserProfilePostCommentsByUserProfilePostId(String userProfilePostId) {
        if (isNullOrBlank(userProfilePostId)) {
            return List.of();
        }

        return _userProfilePostCommentRepository.findAllByUserProfilePostId(userProfilePostId)
            .stream()
            .map(userProfilePostCommentEntity -> Pair.of(userProfilePostCommentEntity.getUserProfile(), userProfilePostCommentEntity))
            .toList();
    }

    @Transactional
    public Pair<Boolean, String> likeDislikeComment(String userProfileCommentId, String userProfileId, ReactionType reactionType) {
        if (isNullOrBlank(userProfileCommentId) || isNullOrBlank(userProfileId)) {
            return Pair.of(false, "Comment ID or User ID is not provided.");
        }

        var optionalUserProfileComment = _userProfilePostCommentRepository.findById(userProfileCommentId);

        if (optionalUserProfileComment.isEmpty()) {
            return Pair.of(false, "Comment not found.");
        }

        var userProfileComment = optionalUserProfileComment.get();

        var optionalUserProfile = _userProfileRepository.findById(userProfileId);

        if (optionalUserProfile.isEmpty()) {
            return Pair.of(false, "User not found.");
        }

        var userProfile = optionalUserProfile.get();

        switch (reactionType) {
            case LIKE:
                if (userProfileComment.getUserProfileLikes().contains(userProfile)) {
                    userProfileComment.getUserProfileLikes().remove(userProfile);
                } else if (userProfileComment.getUserProfileHearts().contains(userProfile)) {
                    userProfileComment.getUserProfileHearts().remove(userProfile);
                    userProfileComment.getUserProfileLikes().add(userProfile); 
                }
                else {
                    userProfileComment.getUserProfileLikes().add(userProfile);
                }
                break;
            case HEART:
                if (userProfileComment.getUserProfileHearts().contains(userProfile)) {
                    userProfileComment.getUserProfileHearts().remove(userProfile);
                } else if (userProfileComment.getUserProfileLikes().contains(userProfile)) {
                    userProfileComment.getUserProfileLikes().remove(userProfile);
                    userProfileComment.getUserProfileHearts().add(userProfile);
                }
                else {
                    userProfileComment.getUserProfileHearts().add(userProfile);
                }
                break;
            default:
                return Pair.of(false, "Invalid reaction type.");
        }

        _userProfilePostCommentRepository.save(userProfileComment);

        return Pair.of(true, "Success");
    }

    @Transactional
    public UserProfilePostCommentEntity createComment(UserProfilePostCommentEntity userProfilePostCommentEntity) {
        userProfilePostCommentEntity.setCreationDateUtc(InstantHelpers.utcNow());

        return _userProfilePostCommentRepository.save(userProfilePostCommentEntity);
    }

    @Transactional
    public boolean deleteUserProfilePostCommentByUserProfilePostCommentId(String userProfilePostCommentId) {
        if (isNullOrBlank(userProfilePostCommentId)) {
            return false;
        }

        var optionalUserProfilePostComment = _userProfilePostCommentRepository.findById(userProfilePostCommentId);

        if (optionalUserProfilePostComment.isEmpty()) {
            return false;
        }

        _userProfilePostCommentRepository.delete(optionalUserProfilePostComment.get());

        return true;
    }

    public UserProfilePostComment convertUserProfilePostCommentEntityToModel(UserProfilePostCommentEntity userProfilePostCommentEntity) {
        var userProfileLikeIds = Optional.ofNullable(userProfilePostCommentEntity.getUserProfileLikes()).isEmpty()
            ? new ArrayList<String>()
            : userProfilePostCommentEntity.getUserProfileLikes().stream().map(profile -> profile.getId()).toList();

        var userProfileHeartIds = Optional.ofNullable(userProfilePostCommentEntity.getUserProfileHearts()).isEmpty()
            ? new ArrayList<String>()
            : userProfilePostCommentEntity.getUserProfileHearts().stream().map(profile -> profile.getId()).toList();

        return new UserProfilePostComment (
            userProfilePostCommentEntity.getId(),
            userProfilePostCommentEntity.getVersion(),
            userProfilePostCommentEntity.getComment(),
            userProfilePostCommentEntity.getCreationDateUtc(),
            userProfilePostCommentEntity.getUserProfile() == null ? UUIDHelpers.DEFAULT_UUID : userProfilePostCommentEntity.getUserProfile().getId(),
            userProfilePostCommentEntity.getUserProfilePost() == null ? UUIDHelpers.DEFAULT_UUID : userProfilePostCommentEntity.getUserProfilePost().getId(),
            userProfileLikeIds,
            userProfileHeartIds
        );
    }

    public UserProfilePostCommentEntity convertUserProfilePostCommentModelToEntity(UserProfilePostComment userProfilePostComment) {
        return UserProfilePostCommentEntity.builder()
            .id(userProfilePostComment.getId())
            .version(userProfilePostComment.getVersion())
            .comment(userProfilePostComment.getComment())
            .creationDateUtc(userProfilePostComment.getCreationDateUtc())
            .userProfile(_userProfileRepository.findById(userProfilePostComment.getUserProfileId()).orElse(null))
            .userProfilePost(_userProfilePostRepository.findById(userProfilePostComment.getUserProfilePostId()).orElse(null))
            .userProfileLikes(_userProfileRepository.findAllById(userProfilePostComment.getUserProfileLikeIds()))
            .userProfileHearts(_userProfileRepository.findAllById(userProfilePostComment.getUserProfileHeartIds()))
            .build();
    }
}
