import 'themes/intertwine/components/navbar.scss';
import MenuBarHelpers from 'Frontend/helpers/menuBarHelpers';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import ProfileSearchResult from 'Frontend/components/profile-search-result/ProfileSearchResult';
import ProfileSettingsDialog from 'Frontend/components/profile-settings-dialog/ProfileSettingsDialog';
import { Icon } from '@hilla/react-components/Icon.js';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useRef, useState } from 'react';
import { SiteEndpoint, UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { MenuBar } from '@hilla/react-components/MenuBar.js';
import { Button } from '@hilla/react-components/Button.js';
import { Dialog } from '@hilla/react-components/Dialog.js';
import { VerticalLayout } from '@hilla/react-components/VerticalLayout.js';

export default function Navbar() {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockname = 'navbar';
    const searchbarBlockName = 'searchbar';
    const searchDialogBlockName = 'search-dialog';

    const { state } = useAuth();
    const [siteName, setSiteName] = useState<string>('');
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [isSearchDialogOpened, setIsSearchDialogOpened] = useState(false);
    const [searchResult, setSearchResult] = useState<UserProfile[]>([]);
    const [isProfileSettingsDialogOpen, setIsProfileSettingsDialogOpen] = useState<boolean>(false);

    const searchValueRef = useRef<HTMLInputElement>(undefined!);

    const navigate = useNavigate();

    const openSearchDialog = () => {
        setIsSearchDialogOpened(true);
    };
  
    const closeSearchDialog = () => {
        setIsSearchDialogOpened(false);
    };

    useEffect(() => {
        (async () => {
            const siteName = await SiteEndpoint.getSiteName();
            setSiteName(siteName);

            const userProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(state.user?.userProfileId!);
            setUserProfile(userProfile);
        })();
    }, [state.user]);

    const submitSearch = async () => {
        const searchValue = searchValueRef.current.value;

        if (!searchValue) {
            return;
        }

        const searchResult = await UserProfileEndpoint.searchUserProfilesByName(searchValue);
        setSearchResult(searchResult);

        openSearchDialog();
    };

    const menuBarItems = [
        {
            component: MenuBarHelpers.renderMenuComponent(
                <Avatar
                    className={`${blockname}-image`}
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
                    text: 'Help - WIP',
                },
                {
                    text: 'Log out',
                },
            ],
        },
    ];

    return (
        <>
            <div slot='navbar' className={`${blockname}-left`}>
                <Link to='/'>
                    <span className={`${blockname}-logo`}>{siteName}</span>
                </Link>
            </div>
            <div slot='navbar' className={`${blockname}-center`}>
                <div className={searchbarBlockName}>
                    <Icon className={`${searchbarBlockName}-icon`} icon='vaadin:search' />
                    <input
                        ref={searchValueRef}
                        placeholder='Search for a friend'
                        className={`${searchbarBlockName}-input`}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                submitSearch();
                            }
                        }}>
                    </input>
                    <Button onClick={submitSearch} className={`${searchbarBlockName}-bottom`} theme='tertiary'>Search</Button>
                </div>
            </div>
            <div slot='navbar' className={`${blockname}-right`}>
                <div className={`${blockname}-links`}>
                    <Link to={'/profile/' + userProfile?.profileDisplayId}>
                        <span className={`${blockname}-link`}>Profile</span>
                    </Link>
                    <Link to='/'>
                        <span className={`${blockname}-link`}>Timeline</span>
                    </Link>
                </div>
                <span className={`${blockname}-text`}>Welcome {userProfile?.firstName}!</span>
                <div className={`${blockname}-icons`}>
                    <Link to='/'>
                        <div className={`${blockname}-icon-item`}>
                            <Icon icon='vaadin:home' />
                            <span className='navbar-icon-badge'>0</span>
                        </div>
                    </Link>
                    <Link to='/messenger'>
                        <div className={`${blockname}-icon-item`}>
                            <Icon icon='vaadin:chat' />
                            <span className='navbar-icon-badge'>0</span>
                        </div>
                    </Link>
                    <div className={`${blockname}-icon-item`}>
                        <Icon icon='vaadin:bell' />
                        (WIP)
                        <span className='navbar-icon-badge'>0</span>
                    </div>
                </div>
                <MenuBar
                    className={`${blockname}-menu-bar`}
                    items={menuBarItems}
                    theme='tertiary-inline'
                    onItemSelected={(event) => {
                        if (event.detail.value.text === 'Log out') {
                            navigate(new URL('/logout', document.baseURI).pathname);
                        } else if (event.detail.value.text === 'Profile') {
                            navigate(new URL(`profile/${userProfile?.profileDisplayId}`, document.baseURI).pathname);
                        } else if (event.detail.value.text === 'Settings') {
                            setIsProfileSettingsDialogOpen(true);
                        }
                    }} />
            </div>
            {isSearchDialogOpened &&
                <Dialog
                    headerTitle={'Search result'}
                    className={searchDialogBlockName}
                    draggable={false}
                    modeless={false}
                    opened={isSearchDialogOpened}
                    onOpenedChanged={(event) => {
                        setIsSearchDialogOpened(event.detail.value);
                    }}
                    footerRenderer={() =>
                        <Button className={`${searchDialogBlockName}-close-button`} onClick={closeSearchDialog} theme='primary'>Close</Button>
                    }>
                    <VerticalLayout className={`${searchDialogBlockName}-main-layout`} style={{ alignItems: 'stretch', minWidth: '50vh', maxWidth: '100vh' }}>
                        <Icon icon='vaadin:close-small' className={`${searchDialogBlockName}-close-icon`} onClick={closeSearchDialog} />
                        <VerticalLayout style={{ alignItems: 'stretch' }}>
                            {searchResult.length > 0 ? searchResult.map((searchResultUserProfile) => (
                                <ProfileSearchResult key={searchResultUserProfile.id} userProfile={searchResultUserProfile} closeSearchDialog={closeSearchDialog} />
                            )) : <span>No profiles found</span>}
                        </VerticalLayout>
                    </VerticalLayout>
                </Dialog>}
            {isProfileSettingsDialogOpen &&
                <ProfileSettingsDialog
                    isDialogOpen={isProfileSettingsDialogOpen}
                    setIsDialogOpen={setIsProfileSettingsDialogOpen}
                    isLoginDialog={false} />}
        </>
    )
}
