import 'themes/intertwine/components/profile-search-result.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link } from 'react-router-dom';

export default function ProfileSearchResult({userProfile, closeSearchDialog}: {userProfile: UserProfile, closeSearchDialog: () => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'profile-search-result';

    return (
        <Link className={`${blockName}-link`} to={'/profile/' + userProfile?.profileDisplayId} onClick={closeSearchDialog}>
            <div className={blockName}>
                <Avatar
                    className={`${blockName}-avatar`}
                    theme='xsmall'
                    img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                    name={userProfile?.fullName} />
                <span className={`${blockName}-name`}>{userProfile?.fullName}</span>
            </div>
        </Link>
    )
}
