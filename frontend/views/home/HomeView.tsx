import 'themes/intertwine/views/home.scss';
import Sidebar from 'Frontend/components/sidebar/Sidebar';
import Feed from 'Frontend/components/feed/Feed';
import Rightbar from 'Frontend/components/rightbar/Rightbar';

export default function HomeView() {
    return (
        <>
            <div className='home-container'>
                <Sidebar />
                <Feed />
                <Rightbar />
            </div>
        </>
    );
}
