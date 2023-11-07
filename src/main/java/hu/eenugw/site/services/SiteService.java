package hu.eenugw.site.services;

import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SiteService {
    @Value("${site.name}")
    private String SITE_NAME;

    @Value("${site.url}")
    private String SITE_URL;

    @Value("${site.email}")
    private String SITE_EMAIL = "dragonhun98@gmail.com";

    @Value("${site.zone}")
    private String siteZoneString;

    private ZoneId SITE_ZONE = ZoneId.of(siteZoneString != null && siteZoneString != "" ? siteZoneString : "Europe/Budapest");

    @Value("${site.environment}")
    private String SITE_ENVIRONMENT;

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

    public ZoneId getSiteZone() {
        return SITE_ZONE;
    }

    public String getSiteEnvironment() {
        return SITE_ENVIRONMENT;
    }
}
