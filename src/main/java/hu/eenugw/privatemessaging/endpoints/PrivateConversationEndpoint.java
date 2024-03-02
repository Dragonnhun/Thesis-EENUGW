package hu.eenugw.privatemessaging.endpoints;

import java.util.List;
import java.util.Optional;

import dev.hilla.Endpoint;
import hu.eenugw.privatemessaging.models.PrivateConversation;
import hu.eenugw.privatemessaging.services.PrivateConversationService;
import jakarta.annotation.security.RolesAllowed;

@Endpoint
@RolesAllowed("ROLE_USER")
public class PrivateConversationEndpoint {
    private final PrivateConversationService _privateConversationService;

    public PrivateConversationEndpoint(PrivateConversationService privateConversationService) {
        _privateConversationService = privateConversationService;
    }

    public Optional<PrivateConversation> getPrivateConversationById(String privateConversationId) {
        return _privateConversationService
            .getPrivateConversationEntityById(privateConversationId)
            .map(_privateConversationService::convertPrivateConversationEntityToModel);
    }

    public Optional<PrivateConversation> createPrivateConversation(String senderUserProfileId, String receiverUserProfileId) {
        return _privateConversationService
            .createPrivateConversationEntity(senderUserProfileId, receiverUserProfileId)
            .map(_privateConversationService::convertPrivateConversationEntityToModel);
    }

    public Optional<PrivateConversation> getOrCreatePrivateConversationEntityByUserProfileIds(String senderUserProfileId, String receiverUserProfileId) {
        return _privateConversationService
            .getOrCreatePrivateConversationEntityByUserProfileIds(senderUserProfileId, receiverUserProfileId)
            .map(_privateConversationService::convertPrivateConversationEntityToModel);
    }
    

    public List<PrivateConversation> getPrivateConversationsByUserProfileId(String userProfileId) {
        return _privateConversationService
            .getPrivateConversationEntitiesByUserProfileId(userProfileId)
            .stream()
            .map(_privateConversationService::convertPrivateConversationEntityToModel)
            .toList();
    }
}
