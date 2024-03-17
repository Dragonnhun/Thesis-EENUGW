import 'themes/intertwine/components/online-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link } from 'react-router-dom';

export default function OnlineFriend({userProfile}: {userProfile?: UserProfile}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'online-friend';

    return (
        <Link to={`/profile/${userProfile?.profileDisplayId}`}>
            <li className={`${blockName}-list-item`}>
                <div className={`${blockName}-list-item-avatar-container`}>
                    <Avatar
                        theme='xsmall'
                        className={`${blockName}-list-item-avatar`}
                        img={assetsFolder + userProfile?.profilePicturePath || 'images/no-profile-picture.png'}
                        name='online-friend-avatar' />
                    <span className={`${blockName}-list-item-online`} />
                </div>
                <span className={`${blockName}-list-item-text`}>{userProfile?.fullName}</span>
            </li>
        </Link>
    )
}
