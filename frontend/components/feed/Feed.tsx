import 'themes/intertwine/components/feed.scss';
import Share from 'Frontend/components/share/Share';
import Post from 'Frontend/components/post/Post';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePost';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint, UserProfilePostEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';

export default function Feed({profileDisplayId}: {profileDisplayId?: string}) {
    const { state } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [userProfilePosts, setUserProfilePosts] = useState<UserProfilePost[]>([]);
    const [posted, setPosted] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const userProfile = await UserProfileEndpoint.getUserProfileByUserId(state.user?.id!);
            setUserProfile(userProfile);
        })();
    }, [state.user]);

    useEffect(() => {
        (async () => {
            const userProfilePosts = profileDisplayId
                ? await UserProfilePostEndpoint.getAllByUserProfileDisplayId(profileDisplayId)
                : await UserProfilePostEndpoint.getTimelineByUserProfileId(state.user?.userProfileId!);

            setUserProfilePosts(userProfilePosts
                .sort((postA, postB) => new Date(postB.creationDateUtc).getTime() - new Date(postA.creationDateUtc).getTime())
            );

            setPosted(false);
        })();
    }, [state.user, profileDisplayId, posted]);

    return (
        <div className='feed'>
            <div className='feed-wrapper'>
                { profileDisplayId == userProfile?.profileDisplayId || !profileDisplayId ? <Share posted={() => setPosted(true)} /> : null }
                {userProfilePosts.map((userProfilePost) => (
                    <Post key={userProfilePost?.id} userProfilePost={userProfilePost} />
                ))}
            </div>
        </div>
    )
}
