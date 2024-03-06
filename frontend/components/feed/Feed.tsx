import 'themes/intertwine/components/feed.scss';
import Share from 'Frontend/components/share/Share';
import Post from 'Frontend/components/post/Post';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePost';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import { useEffect, useState } from 'react';
import { UserProfileEndpoint, UserProfilePostEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';

export default function Feed({profileDisplayId}: {profileDisplayId?: string}) {
    const blockName = 'feed';

    const { state } = useAuth();
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>();
    const [userProfilePosts, setUserProfilePosts] = useState<UserProfilePost[]>([]);
    const [posted, setPosted] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const currentUserProfile = await UserProfileEndpoint.getUserProfileByUserId(state.user?.id!);
            setCurrentUserProfile(currentUserProfile);
        })();
    }, [state.user]);

    useEffect(() => {
        (async () => {
            const userProfilePosts = profileDisplayId
                ? await UserProfilePostEndpoint.getAllUserProfilePostsByProfileDisplayId(profileDisplayId)
                : await UserProfilePostEndpoint.getTimelineByUserProfileId(currentUserProfile?.id!);

            setUserProfilePosts(userProfilePosts
                .sort((postA, postB) => new Date(postB.creationDateUtc).getTime() - new Date(postA.creationDateUtc).getTime())
            );

            setPosted(false);
        })();
    }, [currentUserProfile, profileDisplayId, posted]);

    const deletePostHandler = async (userProfilePostId: string) => {
        const result = await UserProfilePostEndpoint.deleteUserProfilePostByUserProfilePostId(userProfilePostId);
        if (result) {
            setUserProfilePosts(userProfilePosts.filter((post) => post.id !== userProfilePostId));
        }
    }

    return (
        <div className={blockName}>
            <div className={`${blockName}-wrapper`}>
                {(profileDisplayId == currentUserProfile?.profileDisplayId || !profileDisplayId) && <Share posted={() => setPosted(true)} />}
                {userProfilePosts.map((userProfilePost) => (
                    <Post key={userProfilePost?.id} userProfilePost={userProfilePost} deletePostHandler={deletePostHandler} />
                ))}
            </div>
        </div>
    )
}
