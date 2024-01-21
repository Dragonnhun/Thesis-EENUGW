package hu.eenugw.userprofilemanagement.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.eenugw.userprofilemanagement.entities.UserProfile;
import hu.eenugw.userprofilemanagement.repositories.UserProfileRepository;

@Service
public class UserProfileService {
    @Autowired
    private final UserProfileRepository _userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        _userProfileRepository = userProfileRepository;
    }

    public Optional<UserProfile> getById(Long id) {
        return _userProfileRepository.findById(id);
    }

    public Optional<UserProfile> getByUserId(Long userId) {
        return _userProfileRepository.findByUserId(userId);
    }
}
