package hu.eenugw.socketio.models;

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
public class PrivateMessageSendingEventData {
    private String senderUserProfileId;
    private String receiverUserProfileId;
    private String message;
}
