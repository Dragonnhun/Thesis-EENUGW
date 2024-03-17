package hu.eenugw.privatemessaging.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.privatemessaging.entities.PrivateMessageEntity;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessageEntity, String>, JpaSpecificationExecutor<PrivateMessageEntity> {
    List<PrivateMessageEntity> findAllByPrivateConversationId(String privateConversationId);
}
