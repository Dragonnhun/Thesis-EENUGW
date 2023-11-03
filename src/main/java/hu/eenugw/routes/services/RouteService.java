package hu.eenugw.routes.services;

import org.springframework.stereotype.Service;

import hu.eenugw.routes.constants.RouteUrls;

@Service
public class RouteService {
    public RouteService() {

    }

    public String getHomeUrl() {
        return RouteUrls.HOME;
    }

    public String getLoginUrl() {
        return RouteUrls.LOGIN;
    }

    public String getLogoutUrl() {
        return RouteUrls.LOGOUT;
    }

    public String getRegisterUrl() {
        return RouteUrls.REGISTER;
    }

    public String getForgottenPasswordUrl() {
        return RouteUrls.FORGOTTEN_PASSWORD;
    }
}