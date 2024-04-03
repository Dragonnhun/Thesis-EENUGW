package hu.eenugw.core.endpoints;

import java.io.UnsupportedEncodingException;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import hu.eenugw.core.models.Email;
import hu.eenugw.core.services.EmailService;
import jakarta.mail.MessagingException;

@Endpoint
@AnonymousAllowed
public class EmailEndpoint {
    private final EmailService _emailService;

    public EmailEndpoint(EmailService emailService) {
        _emailService = emailService;
    }

    public void sendEmail(Email email) throws UnsupportedEncodingException, MessagingException {
        _emailService.sendEmail(email);
    }
}
