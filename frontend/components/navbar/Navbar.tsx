import 'themes/intertwine/components/navbar.scss';
import MenuBarHelpers from 'Frontend/helpers/menuBarHelpers';
import User from 'Frontend/generated/hu/eenugw/usermanagement/models/User';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { Icon } from '@hilla/react-components/Icon.js';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useState } from 'react';
import { SiteEndpoint, UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { MenuBar, } from '@hilla/react-components/MenuBar.js';

export default function Navbar() {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    const { state, logout } = useAuth();
    const [siteName, setSiteName] = useState<string>('');
    const [userProfile, setUserProfile] = useState<UserProfile | undefined>();

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const siteName = await SiteEndpoint.getSiteName();
            setSiteName(siteName);

            const userProfile = await UserProfileEndpoint.getUserProfileById(state.user?.userProfileId!);
            setUserProfile(userProfile);
        })();
    }, [state.user]);

    const menuBarItems = [
        {
            component: MenuBarHelpers.renderMenuComponent(
                <Avatar
                    className='navbar-image'
                    theme='xsmall'
                    img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                    name={state.user?.username} />
            ),
            children: [
                {
                    text: 'Profile',
                },
                {
                    text: 'Settings',
                },
                {
                    text: 'Help',
                },
                {
                    text: 'Log out',
                },
            ],
        },
    ];

    return (
        <>
            <div slot='navbar' className='navbar-left'>
                <Link to='/'>
                    <span className='navbar-logo'>{siteName}</span>
                </Link>
            </div>
            <div slot='navbar' className='navbar-center'>
                <div className='searchbar'>
                    <Icon className='searchbar-icon' icon='vaadin:search' />
                    <input placeholder='Search for friend, post or video' className='searchbar-input' />
                </div>
            </div>
            <div slot='navbar' className='navbar-right'>
                <div className='navbar-links'>
                    <Link to='/'>
                        <span className='navbar-link'>Homepage</span>
                        <span className='navbar-link'>Timeline</span>
                    </Link>
                </div>
                <div className='navbar-icons'>
                    <div className='navbar-icon-item'>
                        <Icon icon='vaadin:home' />
                        <span className='navbar-icon-badge'>1</span>
                    </div>
                    <div className='navbar-icon-item'>
                        <Icon icon='vaadin:chat' />
                        <span className='navbar-icon-badge'>2</span>
                    </div>
                    <div className='navbar-icon-item'>
                        <Icon icon='vaadin:bell' />
                        <span className='navbar-icon-badge'>1</span>
                    </div>
                </div>
                {/* {currentUser && (
                    <>
                        <MenuBar
                            className='navbar-menu-bar'
                            items={menuBarItems}
                            theme="tertiary-inline"
                            onItemSelected={(event) => {
                                if (event.detail.value.text === 'Log out') {
                                    logout();
                                }
                                if (event.detail.value.text === 'Profile') {
                                    navigate(new URL(`profile/${userProfile?.profileDisplayId}`, document.baseURI).pathname);
                                }
                            }} />
                    </>
                )} */}
                <MenuBar
                    className='navbar-menu-bar'
                    items={menuBarItems}
                    theme="tertiary-inline"
                    onItemSelected={(event) => {
                        if (event.detail.value.text === 'Log out') {
                            logout();
                        }
                        if (event.detail.value.text === 'Profile') {
                            navigate(new URL(`profile/${userProfile?.profileDisplayId}`, document.baseURI).pathname);
                        }
                    }} />
            </div>
        </>
    )
}
