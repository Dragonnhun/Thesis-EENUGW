package hu.eenugw.privatemessaging.entities;

import java.time.Instant;

import hu.eenugw.core.helpers.InstantConverter;
import hu.eenugw.userprofilemanagement.entities.UserProfileEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "privateMessage")
@Table(name = "private_messages")
public class PrivateMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Version
    private int version;

    @Nullable
    @ManyToOne(
        targetEntity = PrivateConversationEntity.class,
        fetch = FetchType.LAZY)
    private PrivateConversationEntity privateConversation;

    @Nullable
    @ManyToOne(
        targetEntity = UserProfileEntity.class,
        fetch = FetchType.LAZY)
    private UserProfileEntity senderUserProfile;

    @Lob
    private String message;

    @Convert(converter = InstantConverter.class)
    public Instant creationDateUtc;
}
