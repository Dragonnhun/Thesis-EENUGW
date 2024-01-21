package hu.eenugw.userprofilemanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.userprofilemanagement.entities.UserProfileComment;

public interface UserProfileCommentRepository extends JpaRepository<UserProfileComment, Long>, JpaSpecificationExecutor<UserProfileComment> {
    
}
