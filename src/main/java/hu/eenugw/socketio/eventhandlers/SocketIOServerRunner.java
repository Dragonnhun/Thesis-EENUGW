package hu.eenugw.socketio.eventhandlers;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import com.corundumstudio.socketio.SocketIOServer;

@Component
public class SocketIOServerRunner implements ApplicationRunner {
    private final SocketIOServer _socketIOServer;

    public SocketIOServerRunner(SocketIOServer socketIOServer) {
        _socketIOServer = socketIOServer;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        _socketIOServer.start();
    }
}
