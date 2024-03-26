package hu.eenugw.userprofilemanagement.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.userprofilemanagement.entities.UserProfilePostPollReactionEntity;

public interface UserProfilePostPollReactionRepository extends JpaRepository<UserProfilePostPollReactionEntity, String>, JpaSpecificationExecutor<UserProfilePostPollReactionEntity> {
    Optional<UserProfilePostPollReactionEntity> findByUserProfilePostIdAndUserProfileId(String userProfilePostId, String userProfileId);
}
