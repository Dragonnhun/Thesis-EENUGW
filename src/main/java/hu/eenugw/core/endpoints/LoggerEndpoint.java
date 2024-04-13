package hu.eenugw.core.endpoints;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import hu.eenugw.core.constants.LogType;
import hu.eenugw.core.services.LoggerService;

@Endpoint
@AnonymousAllowed
public class LoggerEndpoint {
    private final LoggerService _loggerService;

    public LoggerEndpoint(LoggerService loggerService) {
        _loggerService = loggerService;
    }

    public void log(String message, LogType logType) {
        _loggerService.log(message, logType);
    }
}
