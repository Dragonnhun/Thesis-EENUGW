package hu.eenugw.privatemessaging.models;

import java.util.List;

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
public class PrivateConversation {
    private String id;

    private int version;

    private List<String> memberUserProfileIds;

    private List<String> memberUserProfileNames;
}
