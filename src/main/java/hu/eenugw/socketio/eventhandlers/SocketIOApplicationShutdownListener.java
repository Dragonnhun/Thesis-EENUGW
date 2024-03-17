package hu.eenugw.socketio.eventhandlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;
import com.corundumstudio.socketio.SocketIOServer;

@Component
public class SocketIOApplicationShutdownListener implements ApplicationListener<ContextClosedEvent> {
    @Autowired
    private SocketIOServer socketIOServer;

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        socketIOServer.stop();
    }
}
