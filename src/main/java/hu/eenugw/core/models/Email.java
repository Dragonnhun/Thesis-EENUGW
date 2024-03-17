package hu.eenugw.core.models;

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
public class Email {
    private String toAddress;

    private String fromAddress;

    private String senderName;

    private String subject;
    
    private String content;
}
