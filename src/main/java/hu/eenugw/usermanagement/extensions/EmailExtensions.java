package hu.eenugw.usermanagement.extensions;

import hu.eenugw.core.models.Email;
import hu.eenugw.core.services.SiteService;
import hu.eenugw.usermanagement.entities.User;

public class EmailExtensions {
    public static Email verificationEmail(User user, SiteService siteService) {
        var verificationEmail = new Email(
            user.getEmail(),
            siteService.getSiteEmail(),
            siteService.getSiteName(),
            "Please verify your registration",
            "Dear [[NAME]],<br>" 
            + "Please click the link below to verify your registration:<br>" 
            + "<h3><a href=\"[[URL]]\" target=\"_self\">Verify Registration</a></h3>" 
            + "Thank you,<br>" 
            + siteService.getSiteName()
        );
        
        var verifyUrl = siteService.getSiteUrl() + "/register?token=" + user.getRegistrationToken();

        verificationEmail.setContent(verificationEmail.getContent().replace("[[URL]]", verifyUrl));
        verificationEmail.setContent(verificationEmail.getContent().replace("[[NAME]]", user.getUsername()));
        
        return verificationEmail;
    }

    public static Email forgottenPasswordEmail(User user, SiteService siteService) {
        var forgottenPasswordEmail = new Email(
            user.getEmail(),
            siteService.getSiteEmail(),
            siteService.getSiteName(),
            "Password change has been requested",
            "Dear [[NAME]],<br>"
            + "Our site has received a request to change your password.<br>"
            + "If you did not request this, please ignore this email.<br>"
            + "Otherwise, please click the link below to change your password.<br>"
            + "The link below is valid for 24 hours.<br>"
            + "<h3><a href=\"[[URL]]\" target=\"_self\">Reset Password</a></h3>"
            + "Thank you,<br>"
            + siteService.getSiteName()
        );
        
        var resetPasswordUrl = siteService.getSiteUrl() + "/reset-forgotten-password?token=" + user.getForgottenPasswordToken();

        forgottenPasswordEmail.setContent(forgottenPasswordEmail.getContent().replace("[[URL]]", resetPasswordUrl));
        forgottenPasswordEmail.setContent(forgottenPasswordEmail.getContent().replace("[[NAME]]", user.getUsername()));
        
        return forgottenPasswordEmail;
    }

    public static Email passwordChangedEmail(User user, SiteService siteService) {
        var passwordChangedEmail = new Email(
            user.getEmail(),
            siteService.getSiteEmail(),
            siteService.getSiteName(),
            "Your password has been changed",
            "Dear [[NAME]],<br>"
            + "This is a confirmation that the password for your account [[USERNAME]] has just been changed.<br>"
            + "If you did not request this change, please contact us immediately.<br>"
            + "Thank you,<br>"
            + siteService.getSiteName()
        );

        passwordChangedEmail.setContent(passwordChangedEmail.getContent().replace("[[NAME]]", user.getUsername()));
        passwordChangedEmail.setContent(passwordChangedEmail.getContent().replace("[[USERNAME]]", user.getUsername()));
        
        return passwordChangedEmail;
    }
}
