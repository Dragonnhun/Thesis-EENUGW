import 'themes/intertwine/components/chat-online-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import PrivateConversation from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateConversation';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { LoggerEndpoint, PrivateConversationEndpoint } from 'Frontend/generated/endpoints';

export default function ChatOnlineFriend(
    {currentUserProfile, friendUserProfile, setCurrentPrivateConversation}:
        {currentUserProfile?: UserProfile, friendUserProfile?: UserProfile, setCurrentPrivateConversation: (conversation?: PrivateConversation) => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'chat-online-friend';

    const clickHandler = async () => {
        try {
            const result = await PrivateConversationEndpoint.getOrCreatePrivateConversationEntityByUserProfileIds(currentUserProfile?.id!, friendUserProfile?.id!);
            setCurrentPrivateConversation(result);
        } catch (error) {
            console.error(error);
            await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
        }
    }

    return (
        <div className={blockName} onClick={clickHandler}>
            <div className={`${blockName}-item`}>
                <div className={`${blockName}-image-container`}>
                    <Avatar
                        className={`${blockName}-image`}
                        theme='xsmall'
                        img={friendUserProfile?.profilePicturePath ? assetsFolder + friendUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                        name={friendUserProfile?.fullName} />
                    <div className={`${blockName}-online-dot`}></div>
                </div>
                <span className={`${blockName}-name`}>{friendUserProfile?.fullName}</span>
            </div>
        </div>
    )
}
