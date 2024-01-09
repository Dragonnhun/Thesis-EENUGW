package hu.eenugw.core.helpers;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class InstantConverter implements AttributeConverter<Optional<Instant>, Timestamp> {

    @Override
    public Timestamp convertToDatabaseColumn(Optional<Instant> attribute) {
        return attribute.map(Timestamp::from).orElse(null);
    }

    @Override
    public Optional<Instant> convertToEntityAttribute(Timestamp dbData) {
        return Optional.ofNullable(dbData).map(Timestamp::toInstant);
    }
}
