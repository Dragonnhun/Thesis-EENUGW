package hu.eenugw.privatemessaging.endpoints;

import java.util.List;
import java.util.Optional;

import dev.hilla.Endpoint;
import hu.eenugw.privatemessaging.models.PrivateMessage;
import hu.eenugw.privatemessaging.services.PrivateMessageService;
import jakarta.annotation.security.RolesAllowed;

@Endpoint
@RolesAllowed("ROLE_USER")
public class PrivateMessageEndpoint {
    private final PrivateMessageService _privateMessageService;

    public PrivateMessageEndpoint(PrivateMessageService privateMessageService) {
        _privateMessageService = privateMessageService;
    }

    public Optional<PrivateMessage> getPrivateMessageById(String privateMessageId) {
        return _privateMessageService
            .getPrivateMessageEntityById(privateMessageId)
            .map(_privateMessageService::convertPrivateMessageEntityToModel);
    }

    public Optional<PrivateMessage> createPrivateMessage(PrivateMessage privateMessage) {
        return _privateMessageService
            .createPrivateMessageEntity(privateMessage)
            .map(_privateMessageService::convertPrivateMessageEntityToModel);
    }

    public List<PrivateMessage> getPrivateMessagesByConversationId(String privateConversationId) {
        return _privateMessageService
            .getPrivateMessageEntitiesByPrivateConversationId(privateConversationId)
            .stream()
            .map(_privateMessageService::convertPrivateMessageEntityToModel)
            .toList();
    }
}
