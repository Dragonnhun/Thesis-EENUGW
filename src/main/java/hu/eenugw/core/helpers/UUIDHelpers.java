package hu.eenugw.core.helpers;

import java.util.UUID;

public class UUIDHelpers {
    public static final String DEFAULT_UUID = "00000000-0000-0000-0000-000000000000";

    public static String generateUUID() {
        return UUID.randomUUID().toString();
    }
}
