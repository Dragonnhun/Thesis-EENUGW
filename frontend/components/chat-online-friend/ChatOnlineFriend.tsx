import 'themes/intertwine/components/chat-online-friend.scss';

export default function ChatOnlineFriend() {
  return (
    <div className='chat-online-friend'>
        <div className="chat-online-friend-item">
            <div className="chat-online-friend-image-container">
                <img className="chat-online-friend-image" src="images/no-profile-picture.png" alt="" />
                <div className="chat-online-friend-online-dot"></div>
            </div>
            <span className="chat-online-friend-name">Example Name</span>
        </div>
    </div>
  )
}
