import 'themes/intertwine/views/profile.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import Sidebar from 'Frontend/components/sidebar/Sidebar';
import Feed from 'Frontend/components/feed/Feed';
import Rightbar from 'Frontend/components/rightbar/Rightbar';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { useParams } from 'react-router';

export default function ProfileView() {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const params = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile>();

    useEffect(() => {
        (async () => {
            const userProfile = await UserProfileEndpoint.getUserProfileByProfileDisplayId(params.profileDisplayId!);
            setUserProfile(userProfile);
        })();
    }, [params.profileDisplayId]);

    return (
        <>
            <div className='profile-container'>
                <Sidebar />
                <div className='profile-right'>
                    <div className='profile-right-top'>
                        <div className='profile-right-top-cover'>
                            <img 
                                className='profile-right-top-cover-image'
                                src={userProfile?.coverPicturePath ? assetsFolder + userProfile?.coverPicturePath : 'images/no-cover-picture.png'}
                                alt='profile-cover-image' />
                            <Avatar
                                className='profile-right-top-cover-avatar'
                                img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                                name='profile-image' />
                        </div>
                        <div className='profile-right-top-info'>
                            <h4 className='profile-right-top-info-name'>{userProfile?.fullName}</h4>
                            <span className='profile-right-top-info-description'>{userProfile?.description}</span>
                        </div>
                    </div>
                    <div className='profile-right-bottom'>
                    {userProfile && (
                        <>
                            <Feed profileDisplayId={userProfile?.profileDisplayId} />
                            <Rightbar userProfile={userProfile} />
                        </>
                    )}
                    </div>
                </div>
            </div>
        </>
    );
}
