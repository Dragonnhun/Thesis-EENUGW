package hu.eenugw.privatemessaging.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import hu.eenugw.privatemessaging.entities.PrivateConversationEntity;

public interface PrivateConversationRepository extends JpaRepository<PrivateConversationEntity, String>, JpaSpecificationExecutor<PrivateConversationEntity> {
    List<PrivateConversationEntity> findByMemberUserProfilesId(String userProfileId);
}
