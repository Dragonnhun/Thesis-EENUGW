import 'themes/intertwine/components/profile-search-result.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link } from 'react-router-dom';

export default function ProfileSearchResult({userProfile, closeSearchDialog}: {userProfile: UserProfile, closeSearchDialog: () => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <Link className='profile-search-result-link' to={'/profile/' + userProfile?.profileDisplayId} onClick={closeSearchDialog}>
            <div className='profile-search-result'>
                <Avatar
                    className='profile-search-result-avatar'
                    theme='xsmall'
                    img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                    name={userProfile?.fullName} />
                <span className="profile-search-result-name">{userProfile?.fullName}</span>
            </div>
        </Link>
    )
}
