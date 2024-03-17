package hu.eenugw.core.services;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrEmptyOrBlank;

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
        if (isNullOrEmptyOrBlank(image.getBase64()) || isNullOrEmptyOrBlank(image.getExtension()) || imageType == null) {
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

    public Pair<Boolean, String> deleteImage(String imageName, ImageType imageType) {
        if (isNullOrEmptyOrBlank(imageName) || imageType == null) {
            return Pair.of(false, "Image name or type is not provided.");
        }

        try {
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

            var destinationFile = destinationDirectory.resolve(imageName);
            if (Files.exists(destinationFile)) {
                Files.delete(destinationFile);
                return Pair.of(true, "Image removed successfully.");
            }

            return Pair.of(false, "Image not found.");
        } catch (Exception e) {
            e.printStackTrace();
            return Pair.of(false, "Failed to remove image: " + e.getMessage());
        }
    }
}
