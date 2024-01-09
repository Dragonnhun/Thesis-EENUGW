package hu.eenugw.core.helpers;

import java.time.Clock;
import java.time.Instant;

public class InstantHelpers {
    public static Instant utcNow() {
        return Instant.now(Clock.systemUTC());
    }
}
