import 'themes/intertwine/components/sidebar-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link } from 'react-router-dom';

export default function SidebarFriend({userProfile}: {userProfile?: UserProfile}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'sidebar-friend';

    return (
        <Link to={`/profile/${userProfile?.profileDisplayId}`}>
            <li className={blockName}>
                <Avatar
                    className={`${blockName}-avatar`}
                    theme='xsmall'
                    img={assetsFolder + userProfile?.profilePicturePath || 'images/no-profile-picture.png'}
                    name='sidebar-friend-avatar' />
                <span className={`${blockName}-name`}>{userProfile?.fullName}</span>
            </li>
        </Link>
    )
}
