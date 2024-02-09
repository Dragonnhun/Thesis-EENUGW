package hu.eenugw.userprofilemanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.userprofilemanagement.entities.UserProfilePostCommentEntity;

public interface UserProfilePostCommentRepository extends JpaRepository<UserProfilePostCommentEntity, String>, JpaSpecificationExecutor<UserProfilePostCommentEntity> {
    
}