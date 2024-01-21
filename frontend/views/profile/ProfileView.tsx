import 'themes/intertwine/views/profile.scss';
import Sidebar from 'Frontend/components/sidebar/Sidebar';
import Feed from 'Frontend/components/feed/Feed';
import Rightbar from 'Frontend/components/rightbar/Rightbar';
import { Avatar } from '@hilla/react-components/Avatar.js';

export default function ProfileView() {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <>
        <div className="profile-container">
                <Sidebar />
                <div className="profile-right">
                    <div className="profile-right-top">
                        <div className="profile-right-top-cover">
                            <img className='profile-right-top-cover-image' src='images/Lombiq-logo.png' alt='profile-cover-image' />
                            <Avatar className='profile-right-top-cover-avatar' img='images/Lombiq-logo.png' name='profile-image' />
                        </div>
                        <div className="profile-right-top-info">
                            <h4 className="profile-right-top-info-name">Lombiq</h4>
                            <span className="profile-right-top-info-description">This is a description</span>
                        </div>
                    </div>
                    <div className="profile-right-bottom">
                        <Feed isForProfile={true} />
                        <Rightbar isForProfile={true} />
                    </div>
                </div>
            </div>
        </>
    );
}
