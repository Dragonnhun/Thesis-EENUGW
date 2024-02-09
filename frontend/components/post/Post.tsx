import 'themes/intertwine/components/post.scss';
import User from 'Frontend/generated/hu/eenugw/usermanagement/models/User';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePost';
import ReactionType from 'Frontend/generated/hu/eenugw/userprofilemanagement/constants/ReactionType';
import { Link } from 'react-router-dom';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { useEffect, useState } from 'react';
import { TDate, format } from 'timeago.js';
import { UserProfileEndpoint, UserProfilePostEndpoint } from 'Frontend/generated/endpoints';
import { DateTime } from 'luxon';
import { useAuth } from 'Frontend/util/auth';

export default function Post({userProfilePost}: {userProfilePost: UserProfilePost | undefined}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const { state } = useAuth();
    const [currentUser, setCurrentUser] = useState<User>();
    const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
    const [likeCount, setLikeCount] = useState(0);
    const [heartCount, setHeartCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isHearted, setIsHearted] = useState(false);
    const [creationDateLocal, setCreationDateLocal] = useState(DateTime.local().toISO() as string);

    useEffect(() => {
        setLikeCount(userProfilePost?.userProfileLikeIds?.length ?? 0);
        setHeartCount(userProfilePost?.userProfileHeartIds?.length ?? 0);
        setCommentCount(userProfilePost?.userProfilePostCommentIds?.length ?? 0);
        setIsLiked(userProfilePost?.userProfileLikeIds?.includes(currentUser?.userProfileId!) ?? false);
        setIsHearted(userProfilePost?.userProfileHeartIds?.includes(currentUser?.userProfileId!) ?? false);
    }, [currentUser, userProfilePost]);

    const reactionHandler = async (reactionType: ReactionType) => {
        try {
            const result = await UserProfilePostEndpoint.likeDislikePost(userProfilePost?.id!, currentUser?.userProfileId!, reactionType);

            console.log(result);

            if (reactionType === ReactionType.LIKE) {
                if (isHearted) {
                    // User is hearting the post, remove heart and add like
                    setHeartCount(heartCount - 1);
                    setIsHearted(false);
                    setLikeCount(likeCount + 1);
                    setIsLiked(true);
                } else {
                    // User is liking the post, toggle like
                    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
                    setIsLiked(!isLiked);
                }
            } else if (reactionType === ReactionType.HEART) {
                if (isLiked) {
                    // User is liking the post, remove like and add heart
                    setLikeCount(likeCount - 1);
                    setIsLiked(false);
                    setHeartCount(heartCount + 1);
                    setIsHearted(true);
                } else {
                    // User is hearting the post, toggle heart
                    setHeartCount(isHearted ? heartCount - 1 : heartCount + 1);
                    setIsHearted(!isHearted);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        (async () => {
            if (!state.initializing) {
                setCurrentUser(state?.user);
            }

            const userProfile = await UserProfileEndpoint.getUserProfileById(userProfilePost?.userProfileId!);
            setUserProfile(userProfile);

            const creationDateLocal = DateTime.fromISO(userProfilePost?.creationDateUtc as string, { zone: 'utc' }).setZone('local').toISO() as string;
            setCreationDateLocal(creationDateLocal);
        })();
    }, [state, currentUser, userProfilePost]);

    return (
        <div className='post'>
            <div className='post-wrapper'>
                <div className='post-top'>
                    <div className='post-top-left'>
                        <Link className='post-top-left-image-link' to={'/profile/' + userProfile?.profileDisplayId}>
                            <Avatar
                                theme='xsmall'
                                className='post-top-left-image'
                                img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                                name='friend-avatar' />
                        </Link>
                        <Link className='post-top-left-name-link' to={'/profile/' + userProfile?.profileDisplayId}>
                            <span className='post-top-left-name'>{userProfile?.fullName}</span>
                        </Link>
                        <span className='post-top-left-date'>{format(creationDateLocal as TDate)}</span>
                    </div>
                    <div className='post-top-right'>
                        <Icon className='post-top-right-icon fa fa-ellipsis-h' />
                    </div>
                </div>
                <div className='post-center'>
                    <span className='post-center-text'>{userProfilePost?.description}</span>
                    {userProfilePost?.photoPath && <img className='post-center-image' src={assetsFolder + userProfilePost?.photoPath} />}
                </div>
                <div className='post-bottom'>
                    <div className='post-bottom-left'>
                        {/* {likeCount >= heartCount
                            ? <img className='post-bottom-left-like-icon' src='images/like.png' onClick={() => reactionHandler(ReactionType.LIKE)} />
                            : <img className='post-bottom-left-heart-icon' src='images/heart.png' onClick={() => reactionHandler(ReactionType.HEART)} />}
                        {likeCount >= heartCount
                            ? <img className='post-bottom-left-heart-icon' src='images/heart.png' onClick={() => reactionHandler(ReactionType.HEART)} />
                            : <img className='post-bottom-left-like-icon' src='images/like.png' onClick={() => reactionHandler(ReactionType.LIKE)} />} */}
                        {likeCount >= heartCount ? (
                            <img
                                className={isLiked ? 'post-bottom-left-like-icon active' : 'post-bottom-left-like-icon'}
                                src='images/like.png'
                                onClick={() => reactionHandler(ReactionType.LIKE)}
                            />
                        ) : (
                            <img
                                className={isHearted ? 'post-bottom-left-heart-icon active' : 'post-bottom-left-heart-icon'}
                                src='images/heart.png'
                                onClick={() => reactionHandler(ReactionType.HEART)}
                            />
                        )}
                        {likeCount >= heartCount ? (
                            <img
                                className={isHearted ? 'post-bottom-left-heart-icon active' : 'post-bottom-left-heart-icon'}
                                src='images/heart.png'
                                onClick={() => reactionHandler(ReactionType.HEART)}
                            />
                        ) : (
                            <img
                                className={isLiked ? 'post-bottom-left-like-icon active' : 'post-bottom-left-like-icon'}
                                src='images/like.png'
                                onClick={() => reactionHandler(ReactionType.LIKE)}
                            />
                        )}
                        <span className='post-bottom-left-like-counter'>{likeCount + heartCount} {likeCount + heartCount <= 1 ? 'person likes it' : 'people like it'}</span>
                    </div>
                    <div className='post-bottom-right'>
                        <span className="post-bottom-right-comment-text">{commentCount} {commentCount <= 1 ? 'comment' : 'comments'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
