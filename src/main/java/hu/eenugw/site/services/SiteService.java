package hu.eenugw.site.services;

import org.springframework.stereotype.Service;

@Service
public class SiteService {
    public static String SITE_NAME = "THESIS-EENUGW";
    public static String SITE_URL = "http://localhost:8090";
    public static String SITE_EMAIL = "dragonhun98@gmail.com";

    public SiteService() {
        
    }

    public String getSiteName() {
        return SITE_NAME;
    }

    public String getSiteUrl() {
        return SITE_URL;
    }

    public String getSiteEmail() {
        return SITE_EMAIL;
    }
}
