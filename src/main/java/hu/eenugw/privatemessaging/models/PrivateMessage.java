package hu.eenugw.privatemessaging.models;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrivateMessage {
    private String id;

    private int version;

    private String privateConversationId;

    private String senderUserProfileId;

    private String message;

    private Instant creationDateUtc;
}
