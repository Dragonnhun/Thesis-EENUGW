import 'themes/intertwine/components/rightbar.scss';
import OnlineFriend from 'Frontend/components/online-friend/OnlineFriend'
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import StringHelpers from 'Frontend/helpers/stringHelpers';
import ProfileFriend from '../profile-friend/ProfileFriend';
import ProfileSearchResult from '../profile-search-result/ProfileSearchResult';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { useEffect, useRef, useState } from 'react';
import { LoggerEndpoint, UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';
import { Button } from '@hilla/react-components/Button.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { Dialog } from '@hilla/react-components/Dialog.js';
import { VerticalLayout } from '@hilla/react-components/VerticalLayout.js';
import { Socket, io } from 'socket.io-client';

export default function Rightbar({userProfile}: {userProfile?: UserProfile}) {
    const blockName = 'rightbar';
    
    const { state } = useAuth();

    const HomeRightbar = () => {
        const birthdayDialogBlockName = 'birthday-dialog';

        const [userProfileFollowingsWithBirthday, setUserProfileFollowingsWithBirthday] = useState<UserProfile[]>([]);
        const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
        const [otherFriendsCount, setOtherFriendsCount] = useState<number>(0);
        const [isBirthdayDialogOpened, setIsBirthdayDialogOpened] = useState(false);
        const [onlineUsers, setOnlineUsers] = useState({});
        const [followings, setFollowings] = useState<UserProfile[]>([]);
        const [onlineFriends, setOnlineFriends] = useState<UserProfile[]>([]);

        const socket = useRef<Socket>();

        const openBirthdayDialog = () => {
            setIsBirthdayDialogOpened(true);
        };
      
        const closeBirthdayDialog = () => {
            setIsBirthdayDialogOpened(false);
        };

        useEffect(() => {
            (async () => {
                socket.current = io('ws://localhost:8089');
            })();
        }, []);

        useEffect(() => {
            (async () => {
                socket.current?.emit('getConnectedUsersForClient', state.user?.userProfileId!);
    
                socket.current?.on('getConnectedUsersForClient', (users) => {
                    //setOnlineUsers((Object.values(users).filter((userProfleId: string) => userProfile?.followingIds.includes(userProfleId))) ?? {});
                    setOnlineUsers(users);
                });
            })();
        }, [state]);

        useEffect(() => {
            (async () => {
                try {
                    const followings = await UserProfileEndpoint.getUserProfileFollowingsByUserProfileId(state.user?.userProfileId!);
                    setFollowings(followings);
                } catch (error) {
                    console.error(error);
                    await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
                }
            })();
        }, [state]);

        useEffect(() => {
            (async () => {
                try {
                    const onlineFriends = followings.filter(following => Object.values(onlineUsers ?? {}).includes(following?.id));
                    setOnlineFriends(onlineFriends);
                } catch (error) {
                    console.error(error);
                    await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
                }
            })();
        }, [followings, onlineUsers]);

        useEffect(() => {
            (async () => {
                try {
                    const userProfileFollowingsWithBirthday = await UserProfileEndpoint.getUserProfileFollowingsWithBirthday(state.user?.userProfileId!);
                    setUserProfileFollowingsWithBirthday(userProfileFollowingsWithBirthday);
                    if (userProfileFollowingsWithBirthday.length > 0) {
                        const shuffledFollowings = [...userProfileFollowingsWithBirthday].sort(() => Math.random() - 0.5);
        
                        const selectedUser = shuffledFollowings[0];
                        setSelectedUser(selectedUser);
        
                        const otherFriendsCount = shuffledFollowings.length > 1 ? shuffledFollowings.length - 1 : 0;
                        setOtherFriendsCount(otherFriendsCount);
                    }
                } catch (error) {
                    console.error(error);
                    await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
                }
            })();
        }, [state]);

        return (
            <>
                <div 
                    className={`${blockName}-birthday-container ${userProfileFollowingsWithBirthday?.length > 0 ? 'active' : ''}`}
                    onClick={userProfileFollowingsWithBirthday && userProfileFollowingsWithBirthday.length > 0 ? openBirthdayDialog : undefined}>
                    <img className={`${blockName}-birthday-image`} src='images/gift.png' alt='birthday-cake' />
                    <span className={`${blockName}-birthday-text`}>
                        {selectedUser ? (
                            <>
                                <b>{selectedUser.fullName}</b> {userProfileFollowingsWithBirthday?.length === 1 ? ' has' : ` and ${otherFriendsCount} other ${otherFriendsCount === 1 ? 'friend has' : 'friends have'}`} a birthday today.
                            </>
                        ) : <span>No friends have a birthday today.</span>}
                    </span>
                </div>
                <h4 className={`${blockName}-tile`}>Online Friends</h4>
                <ul className={`${blockName}-friend-list`}>
                    {onlineFriends.map((following) => (
                        <OnlineFriend key={following.id} userProfile={following} />
                    ))}
                </ul>
                <Dialog
                    headerTitle={'Birthdays today'}
                    className={birthdayDialogBlockName}
                    draggable={false}
                    modeless={false}
                    opened={isBirthdayDialogOpened}
                    onOpenedChanged={(event) => {
                        setIsBirthdayDialogOpened(event.detail.value);
                    }}
                    footerRenderer={() =>
                        <Button className={`${birthdayDialogBlockName}-close-button`} onClick={closeBirthdayDialog} theme='primary'>Close</Button>
                    }>
                    <VerticalLayout className={`${birthdayDialogBlockName}-main-layout`} style={{ alignItems: 'stretch', minWidth: '50vh', maxWidth: '100vh' }}>
                        <Icon icon='vaadin:close-small' className={`${birthdayDialogBlockName}-close-icon`} onClick={closeBirthdayDialog} />
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
                    <Button theme='primary' className={`${blockName}-follow-button`} onClick={followHandler}>
                        <Icon className={`${blockName}-follow-icon`} slot='suffix' icon={followed ? 'vaadin:minus' : 'vaadin:plus'} />
                        {followed ? 'Unfollow' : 'Follow'}
                    </Button>
                )}
                <h4 className={`${blockName}-user-information-title`}>User Information</h4>
                <div className={`${blockName}-user-information-information`}>
                    <div className={`${blockName}-user-information-information-item`}>
                        <span className={`${blockName}-user-information-information-item-key`}>City:</span>
                        <span className={`${blockName}-user-information-information-item-value`}>{userProfile?.city}</span>
                    </div>
                    <div className={`${blockName}-user-information-information-item`}>
                        <span className={`${blockName}-user-information-information-item-key`}>Hometown:</span>
                        <span className={`${blockName}-user-information-information-item-value`}>{userProfile?.hometown}</span>
                    </div>
                    <div className={`${blockName}-user-information-information-item`}>
                        <span className={`${blockName}-user-information-information-item-key`}>Relationship:</span>
                        <span className={`${blockName}-user-information-information-item-value`}>{StringHelpers.removeUnderscoresAndCapitalizeFirst(userProfile?.relationshipStatus)}</span>
                    </div>
                </div>
                <h4 className={`${blockName}-user-friends-title`}>User Friends</h4>
                <div className={`${blockName}-user-friends-followings`}>
                    {userProfileFollowers?.sort(() => Math.random() - 0.5).slice(0, 15).map((followerUserProfile) => (
                        <ProfileFriend key={followerUserProfile?.id} userProfile={followerUserProfile} />
                    ))}
                </div>
            </>
        )
    };

    return (
        <div className={blockName}>
            <div className={`${blockName}-wrapper`}>
                {userProfile ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}
