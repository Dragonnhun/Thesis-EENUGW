package hu.eenugw.core.endpoints;

import org.springframework.data.util.Pair;

import dev.hilla.Endpoint;
import hu.eenugw.core.constants.ImageType;
import hu.eenugw.core.models.Image;
import hu.eenugw.core.services.FileService;
import jakarta.annotation.security.RolesAllowed;

@Endpoint
@RolesAllowed("ROLE_USER")
public class FileEndpoint {
    private final FileService _fileService;

    public FileEndpoint(FileService fileService) {
        _fileService = fileService;
    }

    public Pair<Boolean, String> uploadImage(Image image, ImageType imageType) {
        return _fileService.uploadImage(image, imageType);
    }
}
