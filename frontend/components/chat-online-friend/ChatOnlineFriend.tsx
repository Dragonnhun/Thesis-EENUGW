import 'themes/intertwine/components/chat-online-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import PrivateConversation from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateConversation';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { PrivateConversationEndpoint } from 'Frontend/generated/endpoints';

export default function ChatOnlineFriend(
    {currentUserProfile, friendUserProfile, setCurrentPrivateConversation}:
        {currentUserProfile?: UserProfile, friendUserProfile?: UserProfile, setCurrentPrivateConversation: (conversation: PrivateConversation | undefined) => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        try {
            const result = await PrivateConversationEndpoint.getOrCreatePrivateConversationEntityByUserProfileIds(currentUserProfile?.id!, friendUserProfile?.id!);
            setCurrentPrivateConversation(result!);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='chat-online-friend' onClick={handleClick}>
            <div className='chat-online-friend-item'>
                <div className='chat-online-friend-image-container'>
                    <Avatar
                        className='chat-online-friend-image'
                        theme='xsmall'
                        img={friendUserProfile?.profilePicturePath ? assetsFolder + friendUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                        name={friendUserProfile?.fullName} />
                    <div className='chat-online-friend-online-dot'></div>
                </div>
                <span className='chat-online-friend-name'>{friendUserProfile?.fullName}</span>
            </div>
        </div>
    )
}
