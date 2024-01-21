package hu.eenugw.core.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.RouterFunctions;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class AssetsConfiguration {
    @Bean
    public RouterFunction<ServerResponse> assetsRouter() {
        return RouterFunctions.resources("/assets/**", new FileSystemResource("././././././././frontend/assets/"));
    }
}
