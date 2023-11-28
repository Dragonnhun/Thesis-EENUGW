package hu.eenugw.data.helpers;

import java.time.Clock;
import java.time.Instant;

public class InstantHelpers {
    public static Instant utcNow() {
        return Instant.now(Clock.systemUTC());
    }
}
