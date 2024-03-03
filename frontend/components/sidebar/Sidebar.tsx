import 'themes/intertwine/components/sidebar.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import SidebarFriend from 'Frontend/components/sidebar-friend/SidebarFriend';
import { Icon } from '@hilla/react-components/Icon.js';
import { Button } from '@hilla/react-components/Button.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'Frontend/util/auth';
import { UserProfileEndpoint } from 'Frontend/generated/endpoints';

export default function Sidebar() {
    const blockName = 'sidebar';
    const listItemBlockName = `${blockName}-list-item`;

    const { state } = useAuth();
    const [showHiddenItems, setShowHiddenItems] = useState(false);
    const [currentUserProfileFollowings, setCurrentUserProfileFollowings] = useState<UserProfile[]>();

    useEffect(() => {
        (async () => {
            const currentUserProfileFollowings = await UserProfileEndpoint.getUserProfileFollowingsByUserProfileId(state?.user?.userProfileId!);
            setCurrentUserProfileFollowings(currentUserProfileFollowings);
        })();
    }, [state.user]);

    return (
        <div className={blockName}>
            <div className={`${blockName}-wrapper`}>
                <ul className={`${blockName}-list`}>
                    <Link to={'/'}>
                        <li className={listItemBlockName}>
                            <Icon className={`${listItemBlockName}-icon`} icon='vaadin:rss' />
                            <span className={`${listItemBlockName}-text`}>Feed</span>
                        </li>
                    </Link>
                    <Link to={'/messenger'}>
                        <li className={listItemBlockName}>
                            <Icon className={`${listItemBlockName}-icon`} icon='vaadin:chat' />
                            <span className={`${listItemBlockName}-text`}>Chats</span>
                        </li>
                    </Link>
                    {showHiddenItems && (
                        <>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:play-circle' />
                                <span className={`${listItemBlockName}-text`}>Videos - WIP</span>
                            </li>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:users' />
                                <span className={`${listItemBlockName}-text`}>Groups - WIP</span>
                            </li>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:bookmark' />
                                <span className={`${listItemBlockName}-text`}>Bookmarks - WIP</span>
                            </li>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:question-circle-o' />
                                <span className={`${listItemBlockName}-text`}>Questions - WIP</span>
                            </li>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:briefcase' />
                                <span className={`${listItemBlockName}-text`}>Jobs - WIP</span>
                            </li>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:calendar' />
                                <span className={`${listItemBlockName}-text`}>Events - WIP</span>
                            </li>
                            <li className={listItemBlockName}>
                                <Icon className={`${listItemBlockName}-icon`} icon='vaadin:academy-cap' />
                                <span className={`${listItemBlockName}-text`}>Courses - WIP</span>
                            </li>
                        </>
                    )}
                </ul>
                <Button
                    className={`${blockName}-button`}
                    theme='primary'
                    onClick={() => setShowHiddenItems(!showHiddenItems)}>
                    {showHiddenItems ? 'Show Less' : 'Show More'}
                </Button>
                <hr className={`${blockName}-line`}/>
                <ul className={`${blockName}-friend-list`}>
                    {currentUserProfileFollowings?.sort(() => Math.random() - 0.5).slice(0, 15).map((followedUserProfile) => (
                        <SidebarFriend key={followedUserProfile?.id} userProfile={followedUserProfile} />
                    ))}
                </ul>
            </div>
        </div>
    )
}
