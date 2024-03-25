package hu.eenugw.core.services;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrEmptyOrBlank;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import hu.eenugw.core.constants.LogType;

@Service
public class LoggerService {
    private static final Logger logger = LoggerFactory.getLogger(LoggerService.class);

    public void log(String message, LogType logType) {
        if (isNullOrEmptyOrBlank(message) || logType == null) return;

        switch (logType) {
            case DEBUG:
                logger.debug(message);
                break;
            case ERROR:
                logger.error(message);
                break;
            case INFO:
                logger.info(message);
                break;
            case TRACE:
                logger.trace(message);
                break;
            case WARN:
                logger.warn(message);
                break;
            default:
                logger.info(message);
                break;
        }
    }
}
