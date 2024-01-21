import 'themes/intertwine/components/online-friend.scss';
import { Avatar } from '@hilla/react-components/Avatar.js';

export default function OnlineFriend({user}: {user: any}) {
  const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
  
  return (
    <li className="rightbar-friend-list-item">
        <div className="rightbar-friend-list-item-avatar-container">
            <Avatar theme='xsmall' className='rightbar-friend-list-item-avatar' img={assetsFolder + user?.profilePicture} name='online-friend-avatar' />
            <span className="rightbar-friend-list-item-online"></span>
        </div>
        <span className="rightbar-friend-list-item-text">{user?.username}</span>
    </li>
  )
}
