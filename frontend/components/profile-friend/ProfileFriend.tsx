import 'themes/intertwine/components/profile-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Link } from 'react-router-dom';

export default function ProfileFriend({userProfile}: {userProfile?: UserProfile}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <Link className='rightbar-user-friends-followings-following-link' to={'/profile/' + userProfile?.profileDisplayId}>
            <div className='rightbar-user-friends-followings-following'>
                <img className='rightbar-user-friends-followings-following-image' src={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'} alt='user-following' />
                <span className='rightbar-user-friends-followings-following-name'>{userProfile?.fullName}</span>
            </div>
        </Link>
    )
}
