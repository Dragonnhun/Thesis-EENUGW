import 'themes/intertwine/components/feed.scss';
import Share from 'Frontend/components/share/Share';
import Post from 'Frontend/components/post/Post';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/entities/UserProfilePost';
import { useEffect, useState } from 'react';
import { UserProfilePostEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';

export default function Feed({isForProfile}: {isForProfile: boolean}) {
    const { state } = useAuth();

    const ProfileFeed = () => {
        return (
            <>
                PROFILE FEED
            </>
        )
    }

    const Feed = () => {
        const [posts, setPosts] = useState<UserProfilePost[]>([]);

        useEffect(() => {
            const fetchPosts = async () => {
                const posts = await UserProfilePostEndpoint.getTimelineForUserProfileId(state?.user?.userProfile?.id ?? 0);

                setPosts(posts);
            }

            fetchPosts();
        }, []);

        return (
           <>
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
           </>
        )
    }

    return (
        <div className='feed'>
            <div className='feed-wrapper'>
                <Share />
                {isForProfile ? <ProfileFeed /> : <Feed />}
            </div>
        </div>
    )
}
