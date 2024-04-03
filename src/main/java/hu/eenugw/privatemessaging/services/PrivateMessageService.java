package hu.eenugw.privatemessaging.services;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrBlank;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hu.eenugw.core.helpers.InstantHelpers;
import hu.eenugw.privatemessaging.entities.PrivateMessageEntity;
import hu.eenugw.privatemessaging.models.PrivateMessage;
import hu.eenugw.privatemessaging.repositories.PrivateConversationRepository;
import hu.eenugw.privatemessaging.repositories.PrivateMessageRepository;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;

@Service
public class PrivateMessageService {
    private final PrivateMessageRepository _privateMessageRepository;
    private final PrivateConversationRepository _privateConversationRepository;
    private final UserProfileRepository _userProfileRepository;

    public PrivateMessageService(
        PrivateMessageRepository privateMessageRepository,
        PrivateConversationRepository privateConversationRepository,
        UserProfileRepository userProfileRepository) {
        _privateMessageRepository = privateMessageRepository;
        _privateConversationRepository = privateConversationRepository;
        _userProfileRepository = userProfileRepository;
    }

    public Optional<PrivateMessageEntity> getPrivateMessageEntityById(String privateMessageId) {
        if (isNullOrBlank(privateMessageId)) {
            return Optional.empty();
        }

        return _privateMessageRepository.findById(privateMessageId);
    }

    public Optional<PrivateMessageEntity> createPrivateMessageEntity(PrivateMessage privateMessage) {
        if (isNullOrBlank(privateMessage.getPrivateConversationId())
            || isNullOrBlank(privateMessage.getSenderUserProfileId())
            || isNullOrBlank(privateMessage.getMessage())) {
            return Optional.empty();
        }

        var privateConversation = _privateConversationRepository.findById(privateMessage.getPrivateConversationId());

        if (privateConversation.isEmpty()) {
            return Optional.empty();
        }

        var senderUserProfile = _userProfileRepository.findById(privateMessage.getSenderUserProfileId());

        if (senderUserProfile.isEmpty()) {
            return Optional.empty();
        }

        var privateMessageEntity = PrivateMessageEntity.builder()
            .privateConversation(privateConversation.get())
            .senderUserProfile(senderUserProfile.get())
            .message(privateMessage.getMessage())
            .creationDateUtc(InstantHelpers.utcNow())
            .build();

        return Optional.of(_privateMessageRepository.save(privateMessageEntity));
    }

    public List<PrivateMessageEntity> getPrivateMessageEntitiesByPrivateConversationId(String privateConversationId) {
        if (isNullOrBlank(privateConversationId)) {
            return List.of();
        }

        return _privateMessageRepository.findAllByPrivateConversationId(privateConversationId);
    }

    public PrivateMessage convertPrivateMessageEntityToModel(PrivateMessageEntity privateMessageEntity) {
        return new PrivateMessage (
            privateMessageEntity.getId(),
            privateMessageEntity.getVersion(),
            privateMessageEntity.getPrivateConversation().getId(),
            privateMessageEntity.getSenderUserProfile().getId(),
            privateMessageEntity.getMessage(),
            privateMessageEntity.getCreationDateUtc()
        );
    }

    public PrivateMessageEntity convertPrivateMessageModelToEntity(PrivateMessage privateMessage) {
        return PrivateMessageEntity.builder()
            .id(privateMessage.getId())
            .version(privateMessage.getVersion())
            .privateConversation(_privateConversationRepository.findById(privateMessage.getPrivateConversationId()).orElse(null))
            .senderUserProfile(_userProfileRepository.findById(privateMessage.getSenderUserProfileId()).orElse(null))
            .message(privateMessage.getMessage())
            .creationDateUtc(privateMessage.getCreationDateUtc())
            .build(
        );
    }
}
