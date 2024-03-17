package hu.eenugw.core.services;

import java.io.UnsupportedEncodingException;
import java.time.Instant;

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
    private final SiteService _siteService;

    public EmailService(JavaMailSender javaMailSender, SiteService siteService) {
        _javaMailSender = javaMailSender;
        _siteService = siteService;
    }

    public void sendEmail(Email email) throws MessagingException, UnsupportedEncodingException {
        var toAddress = email.getToAddress();
        var fromAddress = email.getFromAddress();
        var senderName = email.getSenderName();
        var subject = email.getSubject();

        var header = getEmailHeader().replace("[[SITE_NAME]]", _siteService.getSiteName());
        var footer = getEmailFooter()
            .replace("[[SITE_NAME]]", _siteService.getSiteName())
            .replace("[[SITE_EMAIL]]", _siteService.getSiteEmail())
            .replace("[[CURRENT_YEAR]]", String.valueOf(Instant.now().atZone(_siteService.getSiteZone()).getYear()));

        var content = header + email.getContent() + footer;

        var message = _javaMailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message);
        
        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        
        helper.setText(content, true);
        
        _javaMailSender.send(message);
    }

    private String getEmailHeader() {
        return """
            <div style="width: 100%;">
                <div style="position: relative; padding-bottom: 10%;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                        <div style="position: relative; width: 100%; height: 100%; background-color: hsl(150, 90%, 45%);">
                            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-family: Arial; font-size: 40px; font-weight: bold;">[[SITE_NAME]]</span>
                        </div>
                    </div>
                </div>
            </div>
        """;
    }

    private String getEmailFooter() {
        return """
            <div style="width: 100%;">
                <div style="position: relative; padding-bottom: 15%;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                        <div style="position: relative; width: 100%; height: 100%; background-color: hsl(150, 90%, 45%);">
                            <span style="position: absolute; top: 20%; left: 50%; transform: translateX(-50%); color: white; font-family: Arial; font-size: 24px; font-weight: bold;">[[SITE_NAME]]</span>
                            <span style="position: absolute; top: 40%; left: 50%; transform: translateX(-50%); color: white; font-family: Arial; font-size: 20px;">
                                <a href="mailto:[[SITE_EMAIL]]" style="color: white; text-decoration: none;">Contact us at: [[SITE_EMAIL]]</a>    
                            </span>
                            <span style="position: absolute; top: 60%; left: 50%; transform: translateX(-50%); color: white; font-family: Arial; font-size: 16px;">
                                <a href="#" style="color: white; text-decoration: none;">About us</a> | 
                                <a href="#" style="color: white; text-decoration: none;">Services</a> | 
                                <a href="#" style="color: white; text-decoration: none;">FAQ</a> | 
                                <a href="#" style="color: white; text-decoration: none;">Terms of Service</a> | 
                                <a href="#" style="color: white; text-decoration: none;">Privacy Policy</a>
                            </span>
                            <span style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); color: white; font-family: Arial; font-size: 14px;">© [[CURRENT_YEAR]] [[SITE_NAME]]. All Rights Reserved.</span>
                        </div>
                    </div>
                </div>
            </div>
        """;
    }
}
