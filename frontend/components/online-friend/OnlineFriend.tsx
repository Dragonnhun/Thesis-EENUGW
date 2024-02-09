import 'themes/intertwine/components/online-friend.scss';
import { Avatar } from '@hilla/react-components/Avatar.js';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';

export default function OnlineFriend({userProfile}: {userProfile: UserProfile | undefined}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <li className="rightbar-friend-list-item">
            <div className="rightbar-friend-list-item-avatar-container">
                <Avatar theme='xsmall' className='rightbar-friend-list-item-avatar' img={assetsFolder + userProfile?.profilePicturePath || 'images/no-profile-picture.png'} name='online-friend-avatar' />
                <span className="rightbar-friend-list-item-online"></span>
            </div>
            <span className="rightbar-friend-list-item-text">{userProfile?.fullName}</span>
        </li>
    )
}
