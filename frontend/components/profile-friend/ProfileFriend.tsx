import 'themes/intertwine/components/profile-friend.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Link } from 'react-router-dom';

export default function ProfileFriend({userProfile}: {userProfile?: UserProfile}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'profile-friend';

    return (
        <Link className={`${blockName}-link`} to={'/profile/' + userProfile?.profileDisplayId}>
            <div className={blockName}>
                <img
                    className={`${blockName}-image`}
                    src={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                    alt='user-following' />
                <span className={`${blockName}-name`}>{userProfile?.fullName}</span>
            </div>
        </Link>
    )
}
