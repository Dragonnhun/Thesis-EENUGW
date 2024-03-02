package hu.eenugw.core.helpers;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

public class ProcessIdConverter extends ClassicConverter {
    @Override
    public String convert(ILoggingEvent event) {
        return String.valueOf(ProcessHandle.current().pid());
    }
}
