import 'themes/intertwine/components/conversation.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import PrivateConversation from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateConversation';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { Avatar } from '@hilla/react-components/Avatar.js';

export default function Conversation({userProfile, privateConversation}: {userProfile: UserProfile, privateConversation: PrivateConversation}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const [friendUserProfile, setFriendUserProfile] = useState<UserProfile>();

    useEffect(() => {
        (async () => {
            try {
                const friendUserProfileId = privateConversation.memberUserProfileIds?.find((userProfileId: string) => userProfileId !== userProfile.id);
                const friendUserProfile = await UserProfileEndpoint.getUserProfileById(friendUserProfileId!);
                setFriendUserProfile(friendUserProfile);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [userProfile, privateConversation]);

    return (
        <div className='conversation'>
            <Avatar
                className='conversation-image'
                theme='xsmall'
                img={friendUserProfile?.profilePicturePath ? assetsFolder + friendUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                name={friendUserProfile?.fullName} />
            <span className="conversation-name">{friendUserProfile?.fullName}</span>
        </div>
    )
}

