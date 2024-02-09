package hu.eenugw.userprofilemanagement.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;

public interface UserProfileRepository extends JpaRepository<UserProfileEntity, String>, JpaSpecificationExecutor<UserProfileEntity> {
    Optional<UserProfileEntity> findByUserId(String userId);
    Optional<UserProfileEntity> findByProfileDisplayId(String profileDisplayId);
}
