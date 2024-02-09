import 'themes/intertwine/components/close-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Avatar } from '@hilla/react-components/Avatar.js';

export default function CloseFriend({userProfile}: {userProfile: UserProfile | undefined}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <li className='sidebar-friend-list-item'>
            <Avatar theme='xsmall' className='sidebar-friend-list-item-avatar' img={assetsFolder + userProfile?.profilePicturePath || 'images/no-profile-picture.png'} name='close-friend-avatar' />
            <span className='sidebar-friend-list-item-name'>{userProfile?.fullName}</span>
        </li>
    )
}
