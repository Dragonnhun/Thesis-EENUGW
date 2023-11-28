package hu.eenugw.core.endpoints;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import hu.eenugw.core.services.RouteService;

@Endpoint
@AnonymousAllowed
public class RouteEndpoint {
    private final RouteService _routeService;

    public RouteEndpoint(RouteService routeService) {
        _routeService = routeService;        
    }

    public String getHomeUrl() {
        return _routeService.getHomeUrl();
    }

    public String getLoginUrl() {
        return _routeService.getLoginUrl();
    }

    public String getLogoutUrl() {
        return _routeService.getLogoutUrl();
    }

    public String getRegisterUrl() {
        return _routeService.getRegisterUrl();
    }

    public String getForgottenPasswordUrl() {
        return _routeService.getForgottenPasswordUrl();
    }

    public String getResetForgottenPasswordUrl() {
        return _routeService.getResetForgottenPasswordUrl();
    }
}
