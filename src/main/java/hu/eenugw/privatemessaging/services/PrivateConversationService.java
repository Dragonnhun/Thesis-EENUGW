package hu.eenugw.privatemessaging.services;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hu.eenugw.privatemessaging.entities.PrivateConversationEntity;
import hu.eenugw.privatemessaging.models.PrivateConversation;
import hu.eenugw.privatemessaging.repositories.PrivateConversationRepository;
import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;

@Service
public class PrivateConversationService {
    private final PrivateConversationRepository _privateConversationRepository;
    private final UserProfileRepository _userProfileRepository;

    public PrivateConversationService(
        PrivateConversationRepository privateConversationRepository,
        UserProfileRepository userProfileRepository) {
        _privateConversationRepository = privateConversationRepository;
        _userProfileRepository = userProfileRepository;
    }

    public Optional<PrivateConversationEntity> getPrivateConversationEntityById(String privateConversationId) {
        if (isNullOrBlank(privateConversationId)) {
            return Optional.empty();
        }

        return _privateConversationRepository.findById(privateConversationId);
    }

    public Optional<PrivateConversationEntity> getOrCreatePrivateConversationEntityByUserProfileIds(String senderUserProfileId, String receiverUserProfileId) {
        if (isNullOrBlank(senderUserProfileId) || isNullOrBlank(receiverUserProfileId)) {
            return Optional.empty();
        }

        var senderUserProfileOptional = _userProfileRepository.findById(senderUserProfileId);
        var receiverUserProfileOptional = _userProfileRepository.findById(receiverUserProfileId);

        if (senderUserProfileOptional.isEmpty() || receiverUserProfileOptional.isEmpty()) {
            return Optional.empty();
        }

        var senderUserProfileConversations = _privateConversationRepository.findByMemberUserProfilesId(senderUserProfileOptional.get().getId());

        var conversationWithReceiver = senderUserProfileConversations.stream()
            .filter(conversation -> conversation.getMemberUserProfiles().stream()
                    .anyMatch(profile -> profile.getId().equals(receiverUserProfileId)))
            .findFirst();

        if (conversationWithReceiver.isPresent()) {
            return conversationWithReceiver;
        }

        var receiverUserProfileConversations = _privateConversationRepository.findByMemberUserProfilesId(receiverUserProfileOptional.get().getId());

        var conversationWithSender = receiverUserProfileConversations.stream()
            .filter(conversation -> conversation.getMemberUserProfiles().stream()
                    .anyMatch(profile -> profile.getId().equals(senderUserProfileId)))
            .findFirst();

        if (conversationWithSender.isPresent()) {
            return conversationWithSender;
        }

        return createPrivateConversationEntity(senderUserProfileOptional.get(), receiverUserProfileOptional.get());
    }

    public Optional<PrivateConversationEntity> createPrivateConversationEntity(String senderUserProfileId, String receiverUserProfileId) {
        if (isNullOrBlank(senderUserProfileId) || isNullOrBlank(receiverUserProfileId)) {
            return Optional.empty();
        }

        var senderUserProfile = _userProfileRepository.findById(senderUserProfileId);

        if (senderUserProfile.isEmpty()) {
            return Optional.empty();
        }

        var receiverUserProfile = _userProfileRepository.findById(receiverUserProfileId);

        if (receiverUserProfile.isEmpty()) {
            return Optional.empty();
        }

        var privateConversationEntity = PrivateConversationEntity.builder()
            .memberUserProfiles(List.of(senderUserProfile.get(), receiverUserProfile.get()))
            .build();

        return Optional.of(_privateConversationRepository.save(privateConversationEntity));
    }

    public Optional<PrivateConversationEntity> createPrivateConversationEntity(UserProfileEntity senderUserProfile, UserProfileEntity receiverUserProfile) {
        if (senderUserProfile == null || receiverUserProfile == null) {
            return Optional.empty();
        }

        var privateConversationEntity = PrivateConversationEntity.builder()
            .memberUserProfiles(List.of(senderUserProfile, receiverUserProfile))
            .build();

        return Optional.of(_privateConversationRepository.save(privateConversationEntity));
    }

    public List<PrivateConversationEntity> getPrivateConversationEntitiesByUserProfileId(String userProfileId) {
        if (isNullOrBlank(userProfileId)) {
            return List.of();
        }

        return _privateConversationRepository.findByMemberUserProfilesId(userProfileId);
    }

    public PrivateConversation convertPrivateConversationEntityToModel(PrivateConversationEntity privateConversationEntity) {
        var memberUserProfileIds = Optional.ofNullable(privateConversationEntity.getMemberUserProfiles()).isEmpty()
            ? new ArrayList<String>()
            : privateConversationEntity.getMemberUserProfiles().stream().map(profile -> profile.getId()).toList();

        var memberUserProfileNames = Optional.ofNullable(privateConversationEntity.getMemberUserProfiles()).isEmpty()
            ? new ArrayList<String>()
            : privateConversationEntity.getMemberUserProfiles().stream().map(profile -> profile.getFirstName() + " " + profile.getLastName()).toList();

        return new PrivateConversation (
            privateConversationEntity.getId(),
            privateConversationEntity.getVersion(),
            memberUserProfileIds,
            memberUserProfileNames
        );
    }

    public PrivateConversationEntity convertPrivateConversationModelToEntity(PrivateConversation privateConversation) {
        return PrivateConversationEntity.builder()
            .id(privateConversation.getId())
            .version(privateConversation.getVersion())
            .memberUserProfiles(
                privateConversation.getMemberUserProfileIds()
                    .stream()
                    .map(profileId -> _userProfileRepository.findById(profileId).orElse(null))
                    .filter(profile -> profile != null)
                    .toList())
            .build(
        );
    }
}
