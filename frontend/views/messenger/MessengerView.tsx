import 'themes/intertwine/views/messenger.scss';
import { Button } from '@hilla/react-components/Button.js';
import Conversation from 'Frontend/components/conversation/Conversation';
import Message from 'Frontend/components/message/Message';
import ChatOnlineFriend from 'Frontend/components/chat-online-friend/ChatOnlineFriend';

export default function MessengerView() {
    return (
        <div className='messenger'>
            <div className="chat-menu">
                <div className="chat-menu-wrapper">
                    <input type="text" placeholder='Search for friends' className="chat-menu-search" />
                    <Conversation />
                    <Conversation />
                    <Conversation />
                    <Conversation />
                    <Conversation />
                </div>
            </div>
            <div className="chat-box">
                <div className="chat-box-wrapper">
                    <div className="chat-box-top">
                        <Message />
                        <Message />
                        <Message own={true} />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message own={true} />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message own={true} />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message own={true} />
                        <Message />
                        <Message />
                    </div>
                    <div className="chat-box-bottom">
                        <textarea className='chat-box-bottom-message-box' placeholder='Write something...' />
                        <Button className='chat-box-bottom-message-send-button' theme='primary'>
                            Send
                        </Button>
                    </div>
                </div>
            </div>
            <div className="chat-online-friends">
                <div className="chat-online-friends-wrapper">
                    <ChatOnlineFriend />
                    <ChatOnlineFriend />
                    <ChatOnlineFriend />
                    <ChatOnlineFriend />
                    <ChatOnlineFriend />
                    <ChatOnlineFriend />
                </div>
            </div>
        </div>
    )
}
