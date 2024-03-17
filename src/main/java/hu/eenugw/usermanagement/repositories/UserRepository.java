package hu.eenugw.usermanagement.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import hu.eenugw.usermanagement.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, String>, JpaSpecificationExecutor<UserEntity> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUsernameOrEmail(String username, String email);
    Optional<UserEntity> findByRegistrationToken(String registrationToken);
    Optional<UserEntity> findByForgottenPasswordToken(String forgottenPasswordToken);
}
