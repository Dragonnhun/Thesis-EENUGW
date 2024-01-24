import 'themes/intertwine/components/navbar.scss';
import { Icon } from "@hilla/react-components/Icon.js";
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Link } from 'react-router-dom';
import { useAuth } from 'Frontend/util/auth';

export default function Navbar() {
    const { state, logout } = useAuth();
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <>
            <div slot='navbar' className='navbar-left'>
                <Link to='/'>
                    <span className='navbar-logo'>InterTwine</span>
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
                    <span className='navbar-link'>Homepage</span>
                    <span className='navbar-link'>Timeline</span>
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
                {state.user ? (
                    <>
                        <Avatar onClick={logout} className='navbar-image' theme="xsmall" img={assetsFolder + state.user?.userProfile?.profilePicturePath} name={state.user.username} />
                    </>
                ) : null}
            </div>
        </>
    )
}
