package hu.eenugw.data.services;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import hu.eenugw.data.entities.User;
import hu.eenugw.site.services.SiteService;
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

    public void sendVerificationEmail(User user, String siteURL)
        throws MessagingException, UnsupportedEncodingException {
        var toAddress = user.getEmail();
        var fromAddress = _siteService.getSiteEmail();
        String senderName = _siteService.getSiteName();
        String subject = "Please verify your registration";
        String content = 
            "Dear [[name]],<br>" 
            + "Please click the link below to verify your registration:<br>" 
            + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>" 
            + "Thank you,<br>" 
            + _siteService.getSiteName();

        var message = _javaMailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message);
        
        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        
        content = content.replace("[[name]]", user.getUsername());
        var verifyURL = siteURL + "/register?verification-code=" + user.getVerificationCode();
        
        content = content.replace("[[URL]]", verifyURL);

    public void sendForgottenPasswordEmail(User user, String siteUrl)
        throws MessagingException, UnsupportedEncodingException {
        var toAddress = user.getEmail();
        var fromAddress = _siteService.getSiteEmail();
        String senderName = _siteService.getSiteName();
        String subject = "Password change has been requested";
        String content = 
            "Dear [[name]],<br>" 
            + "Our site has received a request to change your password.<br>"
            + "If you did not request this, please ignore this email.<br>"
            + "Otherwise, please click the link below to change your password.<br>"
            + "The link below is valid for 24 hours.<br>"
            + "<h3><a href=\"[[URL]]\" target=\"_self\">RESET PASSWORD</a></h3>" 
            + "Thank you,<br>" 
            + _siteService.getSiteName();

        var message = _javaMailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message);
        
        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        
        content = content.replace("[[name]]", user.getUsername());
        var resetPasswordUrl = siteUrl + "/forgotten-password?token=" + user.getForgottenPasswordToken();
        
        content = content.replace("[[URL]]", resetPasswordUrl);
        
        helper.setText(content, true);
        
        _javaMailSender.send(message);        
    }
}
