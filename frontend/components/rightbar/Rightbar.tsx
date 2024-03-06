import 'themes/intertwine/components/rightbar.scss';
import OnlineFriend from 'Frontend/components/online-friend/OnlineFriend'
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import StringHelpers from 'Frontend/helpers/stringHelpers';
import ProfileFriend from '../profile-friend/ProfileFriend';
import ProfileSearchResult from '../profile-search-result/ProfileSearchResult';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';
import { Button } from '@hilla/react-components/Button.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { Dialog } from '@hilla/react-components/Dialog.js';
import { VerticalLayout } from '@hilla/react-components/VerticalLayout.js';

export default function Rightbar({userProfile}: {userProfile?: UserProfile}) {
    const { state } = useAuth();

    const HomeRightbar = () => {
        const [userProfileFollowingsWithBirthday, setUserProfileFollowingsWithBirthday] = useState<UserProfile[]>([]);
        const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
        const [otherFriendsCount, setOtherFriendsCount] = useState<number>(0);
        const [isBirthdayDialogOpened, setIsBirthdayDialogOpened] = useState(false);

        const openBirthdayDialog = () => {
            setIsBirthdayDialogOpened(true);
        };
      
        const closeBirthdayDialog = () => {
            setIsBirthdayDialogOpened(false);
        };

        useEffect(() => {
            (async () => {
                const userProfileFollowingsWithBirthday = await UserProfileEndpoint.getUserProfileFollowingsWithBirthday(state.user?.userProfileId!);
                setUserProfileFollowingsWithBirthday(userProfileFollowingsWithBirthday);
                if (userProfileFollowingsWithBirthday && userProfileFollowingsWithBirthday.length > 0) {
                    const shuffledFollowings = [...userProfileFollowingsWithBirthday].sort(() => Math.random() - 0.5);
    
                    const selectedUser = shuffledFollowings[0];
                    setSelectedUser(selectedUser);
    
                    const otherFriendsCount = shuffledFollowings.length > 1 ? shuffledFollowings.length - 1 : 0;
                    setOtherFriendsCount(otherFriendsCount);
                }
            })();
        }, [state]);

        return (
            <>
                <div 
                    className={`rightbar-birthday-container ${userProfileFollowingsWithBirthday?.length > 0 ? 'active' : ''}`}
                    onClick={userProfileFollowingsWithBirthday && userProfileFollowingsWithBirthday.length > 0 ? openBirthdayDialog : undefined}>
                    <img className='rightbar-birthday-image' src='images/gift.png' alt='birthday-cake' />
                    <span className='rightbar-birthday-text'>
                        {selectedUser ? (
                            <>
                                <b>{selectedUser.fullName}</b> {userProfileFollowingsWithBirthday?.length === 1 ? ' has' : ` and ${otherFriendsCount} other ${otherFriendsCount === 1 ? 'friend has' : 'friends have'}`} a birthday today.
                            </>
                        ) : <span>No friends have a birthday today.</span>}
                    </span>
                </div>
                <h4 className='rightbar-title'>Online Friends</h4>
                <ul className='rightbar-friend-list'>
                    {/* {Users.map((u) => (
                    <OnlineFriend key={u.id} user={u} />
                    ))} */}
                </ul>
                <Dialog
                    headerTitle={'Birthdays today'}
                    className='birthday-dialog'
                    draggable={false}
                    modeless={false}
                    opened={isBirthdayDialogOpened}
                    onOpenedChanged={(event) => {
                        setIsBirthdayDialogOpened(event.detail.value);
                    }}
                    footerRenderer={() =>
                        <Button className='birthday-dialog-close-button' onClick={closeBirthdayDialog} theme='primary'>Close</Button>
                    }>
                    <VerticalLayout className='birthday-dialog-main-layout' style={{ alignItems: 'stretch', minWidth: '50vh', maxWidth: '100vh' }}>
                        <Icon icon='vaadin:close-small' className='birthday-dialog-close-icon' onClick={closeBirthdayDialog} />
                        <VerticalLayout style={{ alignItems: 'stretch' }}>
                            {userProfileFollowingsWithBirthday && userProfileFollowingsWithBirthday.length > 0 ? userProfileFollowingsWithBirthday.map((userProfileFollowingWithBirthday) => (
                                <ProfileSearchResult key={userProfileFollowingWithBirthday.id} userProfile={userProfileFollowingWithBirthday} closeSearchDialog={closeBirthdayDialog} />
                            )) : <span>No friends have a birthday today.</span>}
                        </VerticalLayout>
                    </VerticalLayout>
                </Dialog>
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
