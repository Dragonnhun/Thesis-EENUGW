package hu.eenugw.core.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import hu.eenugw.core.configuration.AssetsConfiguration;
import hu.eenugw.core.constants.ImageType;
import hu.eenugw.core.helpers.UUIDHelpers;
import hu.eenugw.core.models.Image;

@Service
public class FileService {
    public Pair<Boolean, String> uploadImage(Image image, ImageType imageType) {
        if (image.getBase64() == null || image.getBase64().isBlank() || image.getExtension() == null || image.getExtension().isBlank() || imageType == null) {
            return Pair.of(false, "Image or type is not provided.");
        }

        try {
            image.setContent(Base64.getDecoder().decode(image.getBase64()));

            Path destinationDirectory = Path.of(AssetsConfiguration.getAssetsFolder());
            switch (imageType) {
                case PROFILE_PICTURE:
                    destinationDirectory = Path.of(AssetsConfiguration.getProfilePicturesFolder());
                    break;

                case COVER_PICTURE:
                    destinationDirectory = Path.of(AssetsConfiguration.getCoverPicturesFolder());
                    break;

                case POST_PICTURE:
                    destinationDirectory = Path.of(AssetsConfiguration.getPostPicturesFolder());
                    break;
            
                default:
                    break;
            }

            if (!Files.exists(destinationDirectory)) {
                Files.createDirectories(destinationDirectory);
            }

            image.setName(UUIDHelpers.generateUUID() + "." + image.getExtension());

            var destinationFile = destinationDirectory.resolve(image.getName());
            Files.write(destinationFile, image.getContent());

            return Pair.of(true, image.getName());
        } catch (Exception e) {
            e.printStackTrace();
            return Pair.of(false, "Failed to upload image: " + e.getMessage());
        }
    }
}
