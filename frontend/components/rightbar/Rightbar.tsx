import 'themes/intertwine/components/rightbar.scss';
import OnlineFriend from 'Frontend/components/online-friend/OnlineFriend'
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import StringHelpers from 'Frontend/helpers/stringHelpers';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint } from 'Frontend/generated/endpoints';
import ProfileFriend from '../profile-friend/ProfileFriend';
import { useAuth } from 'Frontend/util/auth';
import { Button } from '@hilla/react-components/Button.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Notification } from '@hilla/react-components/Notification.js';

export default function Rightbar({userProfile}: {userProfile?: UserProfile}) {
    const { state } = useAuth();

    const HomeRightbar = () => {
        return (
            <>
                <div className='rightbar-birthday-container'>
                    <img className='rightbar-birthday-image' src='images/gift.png' alt='birthday-cake' />
                    <span className='rightbar-birthday-text'><b>Hipster Guy</b> and <b>3 other friends</b> have a birthday today.</span>
                </div>
                <img className='rightbar-advert' src='images/Lombiq-logo.png' alt='advert' />
                <h4 className='rightbar-title'>Online Friends</h4>
                <ul className='rightbar-friend-list'>
                    {/* {Users.map((u) => (
                        <OnlineFriend key={u.id} user={u} />
                    ))} */}
                </ul>
            </>
        )
    };

    const ProfileRightbar = () => {
        const [userProfileFollowers, setUserProfileFollowers] = useState<UserProfile[]>();
        const [followed, setFollowed] = useState<boolean>(false);

        useEffect(() => {
            (async () => {
                const userProfileFollowers = await UserProfileEndpoint.getUserProfileFollowersByUserProfileId(userProfile?.id!);
                setUserProfileFollowers(userProfileFollowers);
            })();
        }, [userProfile, followed]);

        useEffect(() => {
            (async () => {
                userProfileFollowers?.forEach((follower) => {
                    if (follower?.userId === state.user?.id) {
                        setFollowed(true);
                    }
                });
            })();
        }, [userProfileFollowers]);

        const followHandler = async () => {
            try {
                const result = await UserProfileEndpoint.followUnfollowUserProfile(state.user?.userProfileId!, userProfile?.id!);

                if (result.first as boolean) {
                    setFollowed(!followed);
                } else {
                    Notification.show(result.second as string, { theme: 'error', duration: 5000});
                }
            } catch (error) {
                Notification.show(error as string, { theme: 'error', duration: 5000});
            }
        };

        return (
            <>
                {state.user?.id != userProfile?.userId && (
                    <Button theme='primary' className='rightbar-follow-button' onClick={followHandler}>
                        <Icon className='rightbar-follow-icon' slot='suffix' icon={followed ? 'vaadin:minus' : 'vaadin:plus'} />
                        {followed ? 'Unfollow' : 'Follow'}
                    </Button>
                )}
                <h4 className='rightbar-user-information-title'>User Information</h4>
                <div className='rightbar-user-information-information'>
                    <div className='rightbar-user-information-information-item'>
                        <span className='rightbar-user-information-information-item-key'>City:</span>
                        <span className='rightbar-user-information-information-item-value'>{userProfile?.city}</span>
                    </div>
                    <div className='rightbar-user-information-information-item'>
                        <span className='rightbar-user-information-information-item-key'>Hometown:</span>
                        <span className='rightbar-user-information-information-item-value'>{userProfile?.hometown}</span>
                    </div>
                    <div className='rightbar-user-information-information-item'>
                        <span className='rightbar-user-information-information-item-key'>Relationship:</span>
                        <span className='rightbar-user-information-information-item-value'>{StringHelpers.removeUnderscoresAndCapitalizeFirst(userProfile?.relationshipStatus)}</span>
                    </div>
                </div>
                <h4 className='rightbar-user-friends-title'>User Friends</h4>
                <div className='rightbar-user-friends-followings'>
                    {userProfileFollowers?.sort(() => Math.random() - 0.5).slice(0, 15).map((followerUserProfile) => (
                        <ProfileFriend key={followerUserProfile?.id} userProfile={followerUserProfile} />
                    ))}
                </div>
            </>
        )
    };

    return (
        <div className='rightbar'>
            <div className='rightbar-wrapper'>
                {userProfile ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}
