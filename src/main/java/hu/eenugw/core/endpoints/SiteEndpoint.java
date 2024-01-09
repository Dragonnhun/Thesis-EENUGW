package hu.eenugw.core.endpoints;

import java.time.ZoneId;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import hu.eenugw.core.services.SiteService;

@Endpoint
@AnonymousAllowed
public class SiteEndpoint {
    private final SiteService _siteService;

    public SiteEndpoint(SiteService siteService) {
        _siteService = siteService;
    }

    public String getSiteName() {
        return _siteService.getSiteName();
    }

    public String getSiteUrl() {
        return _siteService.getSiteUrl();
    }

    public String getSiteEmail() {
        return _siteService.getSiteEmail();
    }

    public ZoneId getSiteZone() {
        return _siteService.getSiteZone();
    }

    public String getSiteEnvironment() {
        return _siteService.getSiteEnvironment();
    }
}
