import 'themes/intertwine/components/message.scss';
import PrivateMessage from 'Frontend/generated/hu/eenugw/privatemessaging/models/PrivateMessage';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { UserProfileEndpoint, LoggerEndpoint } from 'Frontend/generated/endpoints';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { TDate, format } from 'timeago.js';

export default function Message({privateMessage, own}: {privateMessage: PrivateMessage, own?: boolean}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'message';

    const [creationDateLocal, setCreationDateLocal] = useState(DateTime.local().toISO() as string);
    const [senderUserProfile, setSenderUserProfile] = useState<UserProfile>();

    useEffect(() => {
        (async () => {
            try {
                const senderUserProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(privateMessage?.senderUserProfileId!);
                setSenderUserProfile(senderUserProfile);

                const creationDateLocal = DateTime.fromISO(privateMessage?.creationDateUtc as string, { zone: 'utc' }).setZone('local').toISO() as string;
                setCreationDateLocal(creationDateLocal);
            } catch (error) {
                console.error(error);
                await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
            }
        })();
    }, [privateMessage]);

    return (
        <div className={own ? `${blockName} own` : blockName}>
            <div className={`${blockName}-top`}>
                <Avatar
                    className={`${blockName}-image`}
                    theme='xsmall'
                    img={senderUserProfile?.profilePicturePath ? assetsFolder + senderUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                    name={senderUserProfile?.fullName} />
                <p className={`${blockName}-text`}>{privateMessage?.message}</p>
            </div>
            <div className={`${blockName}-bottom`}>
                {format(creationDateLocal as TDate)}
            </div>
        </div>
    )
}
