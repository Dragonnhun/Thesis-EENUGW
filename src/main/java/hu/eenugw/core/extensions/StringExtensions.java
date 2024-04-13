package hu.eenugw.core.extensions;

public class StringExtensions {
    public static boolean isNullOrBlank(String value) {
        return value == null || value.isBlank();
    }
}
