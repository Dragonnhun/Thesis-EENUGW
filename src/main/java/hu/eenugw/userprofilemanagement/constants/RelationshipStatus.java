package hu.eenugw.userprofilemanagement.constants;

import hu.eenugw.core.constants.Displayable;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum RelationshipStatus implements Displayable {
    SINGLE("Single"),
    IN_RELATIONSHIP("In relationship"),
    ENGAGED("Engaged"),
    MARRIED("Married"),
    IN_COMPLICATED_RELATIONSHIP("In complicated relationship"),
    PREFER_NOT_TO_SAY("Prefer not to say"),
    NOT_SET("Not set");

    private final String displayText;

    @Override
    public String getDisplayText() {
        return displayText;
    }
}
