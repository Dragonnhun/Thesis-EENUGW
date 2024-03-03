import 'themes/intertwine/views/messenger.scss';
import Conversation from 'Frontend/components/conversation/Conversation';
import Message from 'Frontend/components/message/Message';
import ChatOnlineFriend from 'Frontend/components/chat-online-friend/ChatOnlineFriend';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import PrivateConversation from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateConversation';
import PrivateMessage from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateMessage';
import PrivateMessageModel from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateMessageModel';
import UUIDHelpers from 'Frontend/helpers/uuidHelpers';
import { Button } from '@hilla/react-components/Button.js';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useRef, useState } from 'react';
import { PrivateConversationEndpoint, PrivateMessageEndpoint, UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { Socket, io } from 'socket.io-client';

export default function MessengerView() {
    const { state } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [currentPrivateConversation, setCurrentPrivateConversation] = useState<PrivateConversation>();
    const [currentPrivateMessages, setCurrentPrivateMessages] = useState<PrivateMessage[]>([]);
    const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([]);
    const [newPrivateMessage, setNewPrivateMessage] = useState<string>('');
    const [arrivingPrivateMessage, setArrivingPrivateMessage] = useState<PrivateMessage>();
    const [onlineUsers, setOnlineUsers] = useState({});
    const [followings, setFollowings] = useState<UserProfile[]>([]);
    const [onlineFriends, setOnlineFriends] = useState<UserProfile[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
    const socket = useRef<Socket>();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            socket.current = io('ws://localhost:8089');

            socket.current.on('receivePrivateMessage', (data) => {
                const arrivingPrivateMessage = PrivateMessageModel.createEmptyValue();
                arrivingPrivateMessage.id = UUIDHelpers.generateUUID();
                arrivingPrivateMessage.senderUserProfileId = data.senderUserProfileId;
                arrivingPrivateMessage.message = data.message;
                arrivingPrivateMessage.creationDateUtc = new Date().toUTCString();

                setArrivingPrivateMessage(arrivingPrivateMessage);
            });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            arrivingPrivateMessage && currentPrivateConversation?.memberUserProfileIds.includes(arrivingPrivateMessage.senderUserProfileId) &&
            setCurrentPrivateMessages(previous => [...previous, arrivingPrivateMessage]);
        })();
    }, [arrivingPrivateMessage, currentPrivateConversation]);

    useEffect(() => {
        (async () => {
            socket.current?.emit('connectUser', userProfile?.id);

            socket.current?.on('getConnectedUsers', (users) => {
                //setOnlineUsers((Object.values(users).filter((userProfleId: string) => userProfile?.followingIds.includes(userProfleId))) ?? {});
                setOnlineUsers(users);
            });
        })();
    }, [userProfile]);

    useEffect(() => {
        (async () => {
            try {
                const userProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(state.user?.userProfileId!);
                setUserProfile(userProfile);   
            } catch (error) {
                console.error(error);
            }
        })();
    }, [state.user]);

    useEffect(() => {
        (async () => {
            try {
                let privateConversations = await PrivateConversationEndpoint.getPrivateConversationsByUserProfileId(userProfile?.id!);

                if (searchValue) {
                    privateConversations = privateConversations.filter(privateConversation => {
                        return privateConversation.memberUserProfileNames.some(memberUserProfileName => {
                            const pattern = new RegExp(searchValue, 'i');
                            return pattern.test(memberUserProfileName);
                        });
                    });
                }

                setPrivateConversations(privateConversations);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [userProfile, searchValue]);

    useEffect(() => {
        (async () => {
            try {
                const privateMessages = await PrivateMessageEndpoint.getPrivateMessagesByConversationId(currentPrivateConversation?.id!);
                setCurrentPrivateMessages(privateMessages
                    .sort((privateMessageA, privateMessageB) => new Date(privateMessageA.creationDateUtc).getTime() - new Date(privateMessageB.creationDateUtc).getTime()));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [currentPrivateConversation]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentPrivateMessages]);

    useEffect(() => {
        (async () => {
            try {
                const followings = await UserProfileEndpoint.getUserProfileFollowingsByUserProfileId(userProfile?.id!);
                setFollowings(followings);
            } catch (error) {
                console.error(error)
            }
        })();
    }, [userProfile]);

    useEffect(() => {
        (async () => {
            try {
                const onlineFriends = followings.filter(following => Object.values(onlineUsers ?? {}).includes(following?.id));
                setOnlineFriends(onlineFriends);
            } catch (error) {
                console.error(error)
            }
        })();
    }, [followings, onlineUsers]);

    const handlePrivateMessageSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!newPrivateMessage) {
            return;
        }

        const newPrivateMessageModel = PrivateMessageModel.createEmptyValue();
        newPrivateMessageModel.senderUserProfileId = userProfile?.id!;
        newPrivateMessageModel.privateConversationId = currentPrivateConversation?.id!;
        newPrivateMessageModel.message = newPrivateMessage;

        const receiverId = currentPrivateConversation?.memberUserProfileIds.find((id: string) => id != userProfile?.id);

        socket.current?.emit('sendPrivateMessage', {
            senderUserProfileId: userProfile?.id,
            receiverUserProfileId: receiverId,
            message: newPrivateMessage
        });

        try {
            const result = await PrivateMessageEndpoint.createPrivateMessage(newPrivateMessageModel);
            setCurrentPrivateMessages([...currentPrivateMessages, result!]
                .sort((privateMessageA, privateMessageB) => new Date(privateMessageA.creationDateUtc).getTime() - new Date(privateMessageB.creationDateUtc).getTime()));
            setNewPrivateMessage('');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        return () => clearTimeout(typingTimeout!);
    }, [typingTimeout]);

    return (
        <div className='messenger'>
            <div className="chat-menu">
                <div className="chat-menu-wrapper">
                    <input type="text" placeholder='Search for friends' className="chat-menu-search" onChange={event => {
                        clearTimeout(typingTimeout!);
                        const value = event.target.value;
                        setTypingTimeout(setTimeout(() => setSearchValue(value), 500));
                    }} />
                    {privateConversations?.slice(0, 15).map((privateConversation) =>
                        <div key={privateConversation?.id} onClick={() => setCurrentPrivateConversation(privateConversation)}>
                            <Conversation key={privateConversation?.id} userProfile={userProfile!} privateConversation={privateConversation} />
                        </div>
                    )}
                </div>
            </div>
            <div className="chat-box">
                <div className="chat-box-wrapper">
                    {
                        currentPrivateConversation ? (
                            <>
                                <div className="chat-box-top">
                                    {currentPrivateMessages.map((privateMessage) =>
                                        <div ref={scrollRef} key={privateMessage?.id}>
                                            <Message key={privateMessage?.id} privateMessage={privateMessage} own={privateMessage?.senderUserProfileId == userProfile?.id} />
                                        </div>
                                    )}
                                </div>
                                <div className="chat-box-bottom">
                                    <textarea
                                        className='chat-box-bottom-message-box'
                                        placeholder='Write something...'
                                        onChange={(event) => setNewPrivateMessage(event.target.value)}
                                        value={newPrivateMessage} />
                                    <Button className='chat-box-bottom-message-send-button' theme='primary' onClick={handlePrivateMessageSubmit}>
                                        Send
                                    </Button>
                                </div>
                            </>
                        )
                        : (
                            <span className="chat-box-no-private-conversation-selected">
                                Open a conversation to start private messaging.
                            </span>
                        )
                    }
                </div>
            </div>
            <div className="chat-online-friends">
                <div className="chat-online-friends-wrapper">
                    {onlineFriends.map((onlineFriend) => 
                        <ChatOnlineFriend key={onlineFriend.id} currentUserProfile={userProfile} friendUserProfile={onlineFriend} setCurrentPrivateConversation={setCurrentPrivateConversation} />
                    )}
                </div>
            </div>
        </div>
    )
}
