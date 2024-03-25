import 'themes/intertwine/components/conversation.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import PrivateConversation from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateConversation';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint, LoggerEndpoint } from 'Frontend/generated/endpoints';
import { Avatar } from '@hilla/react-components/Avatar.js';

export default function Conversation({userProfile, privateConversation}: {userProfile: UserProfile, privateConversation: PrivateConversation}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'conversation';

    const [friendUserProfile, setFriendUserProfile] = useState<UserProfile>();

    useEffect(() => {
        (async () => {
            try {
                const friendUserProfileId = privateConversation.memberUserProfileIds?.find((userProfileId: string) => userProfileId !== userProfile.id);
                const friendUserProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(friendUserProfileId!);
                setFriendUserProfile(friendUserProfile);
            } catch (error) {
                console.error(error);
                await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
            }
        })();
    }, [userProfile, privateConversation]);

    return (
        <div className={blockName}>
            <Avatar
                className={`${blockName}-image`}
                theme='xsmall'
                img={friendUserProfile?.profilePicturePath ? assetsFolder + friendUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                name={friendUserProfile?.fullName} />
            <span className={`${blockName}-name`}>{friendUserProfile?.fullName}</span>
        </div>
    )
}

