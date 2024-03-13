package hu.eenugw.core.helpers;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class InstantOptionalConverter implements AttributeConverter<Optional<Instant>, Timestamp> {

    @Override
    public Timestamp convertToDatabaseColumn(Optional<Instant> attribute) {
        return attribute != null ? attribute.map(Timestamp::from).orElse(null) : null;
    }

    @Override
    public Optional<Instant> convertToEntityAttribute(Timestamp dbData) {
        return dbData != null ? Optional.ofNullable(dbData).map(Timestamp::toInstant) : null;
    }
}
