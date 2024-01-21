import 'themes/intertwine/components/close-friend.scss';
import { Avatar } from '@hilla/react-components/Avatar.js';

export default function CloseFriend({user}: {user: any}) {
  const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

  return (
    <li className="sidebar-friend-list-item">
        <Avatar theme='xsmall' className='sidebar-friend-list-item-avatar' img={assetsFolder + user?.profilePicture} name='close-friend-avatar' />
        <span className='sidebar-friend-list-item-name'>{user?.username}</span>
    </li>
  )
}

