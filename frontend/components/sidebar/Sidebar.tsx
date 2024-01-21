import 'themes/intertwine/components/sidebar.scss';
import CloseFriend from 'Frontend/components/close-friend/CloseFriend'
import { Icon } from "@hilla/react-components/Icon.js";
import { Button } from '@hilla/react-components/Button.js';

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className='sidebar-wrapper'>
                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:rss' />
                            Feed
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:chat' />
                            Chats
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:play-circle' />
                            Videos
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:users' />
                            Groups
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:bookmark' />
                            Bookmarks
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:question-circle-o' />
                            Questions
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:briefcase' />
                            Jobs
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:calendar' />
                            Events
                        </span>
                    </li>
                    <li className="sidebar-list-item">
                        <span className="sidebar-list-item-text">
                            <Icon className='sidebar-icon' icon='vaadin:academy-cap' />
                            Courses
                        </span>
                    </li>
                </ul>
                <Button className='sidebar-button'>Show More</Button>
                <hr className='sidebar-line'/>
                <ul className="sidebar-friend-list">
                    {/* {Users.map((u) => (
                        <CloseFriend key={u.id} user={u} />
                    ))} */}
                </ul>
            </div>
        </div>
    )
}
