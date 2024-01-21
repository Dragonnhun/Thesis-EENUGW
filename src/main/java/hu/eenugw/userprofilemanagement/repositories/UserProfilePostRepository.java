package hu.eenugw.userprofilemanagement.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.userprofilemanagement.entities.UserProfilePost;

public interface UserProfilePostRepository extends JpaRepository<UserProfilePost, Long>, JpaSpecificationExecutor<UserProfilePost> {
    Optional<List<UserProfilePost>> findAllByUserProfileId(Long userProfileId);
    Optional<List<UserProfilePost>> findAllByUserProfileId(Long userProfileId, Pageable pageable);
}
