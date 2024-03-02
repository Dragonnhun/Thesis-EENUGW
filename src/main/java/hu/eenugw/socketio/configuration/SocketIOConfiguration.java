package hu.eenugw.socketio.configuration;

import static hu.eenugw.core.extensions.StringExtensions.isNullOrEmptyOrBlank;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;

import hu.eenugw.socketio.models.PrivateMessageSendingEventData;

import java.util.HashMap;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class SocketIOConfiguration {
    @Value("${socket.io.ip.address}")
    private String socketIOIpAddress;

    @Value("${socket.io.port}")
    private String socketIOPort;

    private static final Logger logger = LoggerFactory.getLogger(SocketIOConfiguration.class);

    @Bean
    protected SocketIOServer socketIOServer() {
        var config = new Configuration();
        config.setHostname(socketIOIpAddress);
        config.setPort(Integer.parseInt(socketIOPort));

        var server = new SocketIOServer(config);
        // A list of user profile IDs and their session IDs.
        var userProfiles = new HashMap<String, String>();

        // When disconnecting by closing the browser or refreshing the page.
        server.addDisconnectListener(client -> {
            var clientSessionId = client.getSessionId().toString();

            if (userProfiles.containsKey(clientSessionId)) {
                userProfiles.remove(clientSessionId);

                logger.info("User profile removed with Session ID: " + clientSessionId);

                sendConnectedUsersToAllClients(server, userProfiles);
            }
        });
        
        // When connecting by calling the connectUser event.
        server.addEventListener("connectUser", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient client, String userProfileId, AckRequest ackRequest) {
                if (isNullOrEmptyOrBlank(userProfileId)) {
                    logger.info("Cannot connect user profile. ID is empty or null: " + userProfileId);

                    return;
                }

                if (userProfiles.containsValue(userProfileId)) {
                    logger.info("Cannot connect user profile. Already added: " + userProfileId);

                    return;
                }

                userProfiles.put(client.getSessionId().toString(), userProfileId);
                logger.info("User profile added: " + userProfileId);

                sendConnectedUsersToAllClients(server, userProfiles);
            }
        });

        // When disconnecting by calling the disconnectUser event.
        server.addEventListener("disconnectUser", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient client, String userProfileId, AckRequest ackRequest) {
                if (isNullOrEmptyOrBlank(userProfileId)) {
                    logger.info("Cannot disconnect user profile. ID is empty or null: " + userProfileId);

                    return;
                }

                if (!userProfiles.containsValue(userProfileId)) {
                    logger.info("Cannot disconnect user profile. Has not been added yet: " + userProfileId);

                    return;
                }

                var userProfileEntry = getUserProfileEntry(userProfiles, userProfileId);

                if (userProfileEntry != null) {
                    userProfiles.remove(userProfileEntry.getKey(), userProfileEntry.getValue());

                    logger.info("User profile removed with Session ID: " + userProfileEntry.getKey());
    
                    sendConnectedUsersToAllClients(server, userProfiles);

                    return;
                }
            }
        });

        // When sending a private message by calling the sendPrivateMessage event.
        server.addEventListener("sendPrivateMessage", PrivateMessageSendingEventData.class, new DataListener<PrivateMessageSendingEventData>() {
            @Override
            public void onData(SocketIOClient client, PrivateMessageSendingEventData privateMessageSendingEventData, AckRequest ackRequest) {
                var receiverUserProfileEntry = getUserProfileEntry(userProfiles, privateMessageSendingEventData.getReceiverUserProfileId());

                if (receiverUserProfileEntry == null) {
                    logger.info("Cannot send private message. Receiver user profile not found: " + privateMessageSendingEventData.getReceiverUserProfileId());

                    return;
                }

                var clientToSendMessageTo = server
                    .getAllClients()
                    .stream()
                    .filter(connectedClient -> connectedClient.getSessionId().toString().equals(receiverUserProfileEntry.getKey()))
                    .findFirst();

                if (clientToSendMessageTo.isPresent()) {
                    clientToSendMessageTo.get().sendEvent("receivePrivateMessage", privateMessageSendingEventData);
                }
            }
        });

        return server;
    }

    private void sendConnectedUsersToAllClients(SocketIOServer server, HashMap<String, String> userProfiles) {
        server.getAllClients().forEach(connectedClient -> {
            connectedClient.sendEvent("getConnectedUsers", userProfiles);
        });
    }

    private Entry<String, String> getUserProfileEntry(HashMap<String, String> userProfiles, String userProfileId) {
        for (var userProfile : userProfiles.entrySet()) {
            if (userProfile.getValue().equals(userProfileId)) {
                return userProfile;
            }                    
        }

        return null;
    }
}
