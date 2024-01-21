import 'themes/intertwine/components/rightbar.scss';
import OnlineFriend from 'Frontend/components/online-friend/OnlineFriend'

export default function Rightbar({isForProfile}: {isForProfile: boolean}) {

    const HomeRightbar = () => {
        return (
            <>
                <div className='rightbar-birthday-container'>
                    <img className='rightbar-birthday-image' src='images/gift.png' alt='birthday-cake' />
                    <span className='rightbar-birthday-text'><b>Hipster Guy</b> and <b>3 other friends</b> have a birthday today.</span>
                </div>
                <img className='rightbar-advert' src='images/Lombiq-logo.png' alt='advert' />
                <h4 className="rightbar-title">Online Friends</h4>
                <ul className="rightbar-friend-list">
                    {/* {Users.map((u) => (
                        <OnlineFriend key={u.id} user={u} />
                    ))} */}
                </ul>
            </>
        )
    };

    const ProfileRightbar = () => {
        return (
            <>
                <h4 className="rightbar-user-information-title">User Information</h4>
                <div className="rightbar-user-information-information">
                    <div className="rightbar-user-information-information-item">
                        <span className="rightbar-user-information-information-item-key">City:</span>
                        <span className="rightbar-user-information-information-item-value">New York</span>
                    </div>
                    <div className="rightbar-user-information-information-item">
                        <span className="rightbar-user-information-information-item-key">From:</span>
                        <span className="rightbar-user-information-information-item-value">Madrid</span>
                    </div>
                    <div className="rightbar-user-information-information-item">
                        <span className="rightbar-user-information-information-item-key">Relationship:</span>
                        <span className="rightbar-user-information-information-item-value">Single</span>
                    </div>
                </div>
                <h4 className="rightbar-user-friends-title">User Friends</h4>
                <div className="rightbar-user-friends-followings">
                    <div className="rightbar-user-friends-followings-following">
                        <img className="rightbar-user-friends-followings-following-image" src="images/Lombiq-logo.png" alt="user-following" />
                        <span className="rightbar-user-friends-followings-following-name">John Carter</span>
                    </div>
                    <div className="rightbar-user-friends-followings-following">
                        <img className="rightbar-user-friends-followings-following-image" src="images/Lombiq-logo.png" alt="user-following" />
                        <span className="rightbar-user-friends-followings-following-name">John Carter</span>
                    </div>
                    <div className="rightbar-user-friends-followings-following">
                        <img className="rightbar-user-friends-followings-following-image" src="images/Lombiq-logo.png" alt="user-following" />
                        <span className="rightbar-user-friends-followings-following-name">John Carter</span>
                    </div>
                    <div className="rightbar-user-friends-followings-following">
                        <img className="rightbar-user-friends-followings-following-image" src="images/Lombiq-logo.png" alt="user-following" />
                        <span className="rightbar-user-friends-followings-following-name">John Carter</span>
                    </div>
                    <div className="rightbar-user-friends-followings-following">
                        <img className="rightbar-user-friends-followings-following-image" src="images/Lombiq-logo.png" alt="user-following" />
                        <span className="rightbar-user-friends-followings-following-name">John Carter</span>
                    </div>
                    <div className="rightbar-user-friends-followings-following">
                        <img className="rightbar-user-friends-followings-following-image" src="images/Lombiq-logo.png" alt="user-following" />
                        <span className="rightbar-user-friends-followings-following-name">John Carter</span>
                    </div>
                </div>
            </>
        )
    };

    return (
        <div className='rightbar'>
            <div className='rightbar-wrapper'>
                {isForProfile ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}
