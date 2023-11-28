package hu.eenugw.core.services;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import hu.eenugw.core.models.Email;
import jakarta.mail.MessagingException;

@Service
public class EmailService {
    @Autowired
    private final JavaMailSender _javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        _javaMailSender = javaMailSender;
    }

    public void sendEmail(Email email) throws MessagingException, UnsupportedEncodingException {
        var toAddress = email.getToAddress();
        var fromAddress = email.getFromAddress();
        String senderName = email.getSenderName();
        String subject = email.getSubject();
        String content = email.getContent();

        var message = _javaMailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message);
        
        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        
        helper.setText(content, true);
        
        _javaMailSender.send(message);
    }
}
