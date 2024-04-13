package hu.eenugw.core.configuration;

import java.io.File;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.RouterFunctions;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class AssetsConfiguration {
    private static final FileSystemResource ASSETS_FILE_SYSTEM_RESOURCE =
        new FileSystemResource(new File("").getAbsolutePath() + "/frontend/assets/");

    @Bean
    protected RouterFunction<ServerResponse> assetsRouter() {
        return RouterFunctions.resources("/assets/**", ASSETS_FILE_SYSTEM_RESOURCE);
    }

    public static String getAssetsFolder() {
        return ASSETS_FILE_SYSTEM_RESOURCE.getPath();
    }

    public static String getPostPicturesFolder() {
        return ASSETS_FILE_SYSTEM_RESOURCE.getPath() + "images/post-pictures";
    }

    public static String getCoverPicturesFolder() {
        return ASSETS_FILE_SYSTEM_RESOURCE.getPath() + "images/cover-pictures";
    }

    public static String getProfilePicturesFolder() {
        return ASSETS_FILE_SYSTEM_RESOURCE.getPath() + "images/profile-pictures";
    }
}
