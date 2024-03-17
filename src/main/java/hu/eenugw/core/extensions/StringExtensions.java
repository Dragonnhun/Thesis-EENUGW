package hu.eenugw.core.extensions;

public class StringExtensions {
    public static boolean isNullOrEmptyOrBlank(String value) {
        return value == null || value.isEmpty() || value.isBlank();
    }
}
