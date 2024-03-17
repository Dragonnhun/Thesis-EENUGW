package hu.eenugw.userprofilemanagement.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.userprofilemanagement.entities.UserProfilePostEntity;

public interface UserProfilePostRepository extends JpaRepository<UserProfilePostEntity, String>, JpaSpecificationExecutor<UserProfilePostEntity> {
    List<UserProfilePostEntity> findAllByUserProfileId(String userProfileId);
    List<UserProfilePostEntity> findAllByUserProfileId(String userProfileId, Pageable pageable);
}
