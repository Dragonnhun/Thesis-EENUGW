import { Avatar } from '@hilla/react-components/Avatar.js';
import { UserProfileEndpoint } from 'Frontend/generated/endpoints';
import PrivateMessage from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateMessage';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import 'themes/intertwine/components/message.scss';
import { TDate, format } from 'timeago.js';

export default function Message({privateMessage, own}: {privateMessage: PrivateMessage, own?: boolean}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const [creationDateLocal, setCreationDateLocal] = useState(DateTime.local().toISO() as string);
    const [senderUserProfile, setSenderUserProfile] = useState<UserProfile>();

    useEffect(() => {
        (async () => {
            try {
                const senderUserProfile = await UserProfileEndpoint.getUserProfileById(privateMessage?.senderUserProfileId!);
                setSenderUserProfile(senderUserProfile);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [privateMessage]);
  
    useEffect(() => {
        (async () => {
            try {
                const creationDateLocal = DateTime.fromISO(privateMessage?.creationDateUtc as string, { zone: 'utc' }).setZone('local').toISO() as string;
                setCreationDateLocal(creationDateLocal);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [privateMessage]);

    return (
        <div className={own ? 'message own' : 'message'}>
            <div className='message-top'>
                <Avatar
                    className='message-image'
                    theme='xsmall'
                    img={senderUserProfile?.profilePicturePath ? assetsFolder + senderUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                    name={senderUserProfile?.fullName} />
                <p className='message-text'>{privateMessage?.message}</p>
            </div>
            <div className='message-bottom'>
                {format(creationDateLocal as TDate)}
            </div>
        </div>
    )
}
