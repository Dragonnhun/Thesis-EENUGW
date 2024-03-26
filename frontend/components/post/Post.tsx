import 'themes/intertwine/components/post.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePost';
import ReactionType from 'Frontend/generated/hu/eenugw/userprofilemanagement/constants/ReactionType';
import MenuBarHelpers from 'Frontend/helpers/menuBarHelpers';
import Comments from 'Frontend/components/comments/Comments';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import PostType from 'Frontend/generated/hu/eenugw/userprofilemanagement/constants/PostType';
import UserProfilePostPollReaction from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePostPollReaction';
import { Link } from 'react-router-dom';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Key, useEffect, useState } from 'react';
import { TDate, format } from 'timeago.js';
import { LoggerEndpoint, UserProfileEndpoint, UserProfilePostEndpoint } from 'Frontend/generated/endpoints';
import { DateTime } from 'luxon';
import { useAuth } from 'Frontend/util/auth';
import { MenuBar } from '@hilla/react-components/MenuBar.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { RadioGroup } from '@hilla/react-components/RadioGroup.js';
import { RadioButton } from '@hilla/react-components/RadioButton.js';

export default function Post(
    {userProfilePost, deletePostHandler}:
        {userProfilePost?: UserProfilePost, deletePostHandler: (userProfilePostId: string) => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'post';

    const { state } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
    const [userProfilePostPollReaction, setUserProfilePostPollReaction] = useState<UserProfilePostPollReaction | undefined>();
    const [likeCount, setLikeCount] = useState(0);
    const [heartCount, setHeartCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [votesCount, setVotesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isHearted, setIsHearted] = useState(false);
    const [creationDateLocal, setCreationDateLocal] = useState(DateTime.local().toISO() as string);
    const [isPostCommentsOpen, setPostCommentsOpen] = useState(false);
    const [didPostComment, setDidPostComment] = useState(false);
    const [didDeleteComment, setDidDeleteComment] = useState(false);

    useEffect(() => {
        (async () => {
            const userProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(userProfilePost?.userProfileId!);
            setUserProfile(userProfile);
    
            const creationDateLocal = DateTime.fromISO(userProfilePost?.creationDateUtc as string, { zone: 'utc' }).setZone('local').toISO() as string;
            setCreationDateLocal(creationDateLocal);
    
            setLikeCount(userProfilePost?.userProfileLikeIds?.length ?? 0);
            setHeartCount(userProfilePost?.userProfileHeartIds?.length ?? 0);
            setCommentCount(userProfilePost?.userProfilePostCommentIds?.length ?? 0);
            setIsLiked(userProfilePost?.userProfileLikeIds?.includes(state.user?.userProfileId!) ?? false);
            setIsHearted(userProfilePost?.userProfileHeartIds?.includes(state.user?.userProfileId!) ?? false);

            const userProfilePostPollReaction = await UserProfilePostEndpoint.getPollReactionByUserProfilePostIdAndUserProfileId(userProfilePost?.id!, state.user?.userProfileId!);
            setUserProfilePostPollReaction(userProfilePostPollReaction);

            setVotesCount(userProfilePost?.userProfilePostPollReactionIds?.length ?? 0);
        })();
    }, [state, userProfilePost]);

    useEffect(() => {
        (async () => {
            if (didPostComment) {
                setCommentCount(commentCount + 1);
            } else if (didDeleteComment) {
                setCommentCount(commentCount - 1);
            }

            setDidPostComment(false);
            setDidDeleteComment(false);
        })();
    }, [didPostComment, didDeleteComment]);

    const reactionHandler = async (reactionType: ReactionType) => {
        try {
            const result = await UserProfilePostEndpoint.likeDislikePost(userProfilePost?.id!, state.user?.userProfileId!, reactionType);

            if (!(result.first as boolean)) {
                Notification.show('Reaction could not be created!', {
                    position: 'top-center',
                    duration: 2000,
                    theme: 'error',
                });

                return;
            }

            if (reactionType === ReactionType.LIKE) {
                if (isHearted) {
                    // User is hearting the post, remove heart and add like.
                    setHeartCount(heartCount - 1);
                    setIsHearted(false);
                    setLikeCount(likeCount + 1);
                    setIsLiked(true);
                } else {
                    // User is liking the post, toggle like.
                    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
                    setIsLiked(!isLiked);
                }
            } else if (reactionType === ReactionType.HEART) {
                if (isLiked) {
                    // User is liking the post, remove like and add heart.
                    setLikeCount(likeCount - 1);
                    setIsLiked(false);
                    setHeartCount(heartCount + 1);
                    setIsHearted(true);
                } else {
                    // User is hearting the post, toggle heart.
                    setHeartCount(isHearted ? heartCount - 1 : heartCount + 1);
                    setIsHearted(!isHearted);
                }
            }
        } catch (error) {
            console.error(error);
            await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
        }
    }

    return (
        <div className={blockName}>
            <div className={`${blockName}-wrapper`}>
                <div className={`${blockName}-top`}>
                    <div className={`${blockName}-top-left`}>
                        <Link className={`${blockName}-top-left-link`} to={'/profile/' + userProfile?.profileDisplayId}>
                            <Avatar
                                theme='xsmall'
                                className={`${blockName}-top-left-avatar`}
                                img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                                name='friend-avatar' />
                            <span className={`${blockName}-top-left-name`}>{userProfile?.fullName}</span>
                        </Link>
                        <span className={`${blockName}-top-left-date`}>{format(creationDateLocal as TDate)}</span>
                    </div>
                    <div className={`${blockName}-top-right`}>
                        {state.user?.userProfileId === userProfilePost?.userProfileId && (
                            <MenuBar
                                className={`${blockName}-menu-bar`}
                                items={
                                    [
                                        {
                                            component: MenuBarHelpers.renderMenuComponent(
                                                <Icon className={`${blockName}-top-right-icon fa fa-ellipsis-h`} />
                                            ),
                                            children: [
                                                {
                                                    text: 'Delete',
                                                },
                                            ],
                                        },
                                    ]
                                }
                                theme='tertiary'
                                onItemSelected={(event) => {
                                    if (event.detail.value.text === 'Delete') {
                                        deletePostHandler(userProfilePost?.id!);
                                    }
                                }} />
                        )}
                    </div>
                </div>
                <div className={`${blockName}-center`}>
                    <span className={`${blockName}-center-text`}>{userProfilePost?.description}</span>
                    {(userProfilePost?.postType === PostType.POLL || userProfilePost?.postType === PostType.EVENT) && (
                        <div className={`${blockName}-center-poll`}>
                            <RadioGroup label='Please choose an answer!' theme='vertical'>
                                {userProfilePost?.pollOptions.map((option: string, index: Key) => (
                                    <RadioButton 
                                        key={index}
                                        value={option}
                                        label={option}
                                        checked={userProfilePostPollReaction?.reaction === option}
                                        onClick={async () => {
                                            const result = await UserProfilePostEndpoint.votePoll(userProfilePost?.id!, state.user?.userProfileId!, option);
                                            if (result) {
                                                setUserProfilePostPollReaction(result);

                                                if (!userProfilePost.userProfilePostPollReactionIds?.includes(result.id)) {
                                                    userProfilePost.userProfilePostPollReactionIds?.push(result.id);
                                                    setVotesCount(votesCount + 1);
                                                }
                                            }
                                        }} />
                                ))}
                            </RadioGroup>
                            <span className={`${blockName}-center-poll-text`}>Total votes: {votesCount}</span>
                        </div>
                    )}
                    {userProfilePost?.photoPath && <img className={`${blockName}-center-image`} src={assetsFolder + userProfilePost?.photoPath} />}
                </div>
                <div className={`${blockName}-bottom`}>
                    <div className={`${blockName}-bottom-left`}>
                        {likeCount >= heartCount ? (
                            <img
                                className={isLiked ? `${blockName}-bottom-left-like-icon active` : `${blockName}-bottom-left-like-icon`}
                                src='images/like.png'
                                onClick={() => reactionHandler(ReactionType.LIKE)} />
                        ) : (
                            <img
                                className={isHearted ? `${blockName}-bottom-left-heart-icon active` : `${blockName}-bottom-left-heart-icon`}
                                src='images/heart.png'
                                onClick={() => reactionHandler(ReactionType.HEART)}
                            />
                        )}
                        {likeCount >= heartCount ? (
                            <img
                                className={isHearted ? `${blockName}-bottom-left-heart-icon active` : `${blockName}-bottom-left-heart-icon`}
                                src='images/heart.png'
                                onClick={() => reactionHandler(ReactionType.HEART)}
                            />
                        ) : (
                            <img
                                className={isLiked ? `${blockName}-bottom-left-like-icon active` : `${blockName}-bottom-left-like-icon`}
                                src='images/like.png'
                                onClick={() => reactionHandler(ReactionType.LIKE)}
                            />
                        )}
                        <span className={`${blockName}-bottom-left-like-counter`}>{likeCount + heartCount} {likeCount + heartCount <= 1 ? 'person likes it' : 'people like it'}</span>
                    </div>
                    <div className={`${blockName}-bottom-right`}>
                        <span className={`${blockName}-bottom-right-comment-text`} onClick={() => setPostCommentsOpen(!isPostCommentsOpen)}>{commentCount} {commentCount <= 1 ? 'comment' : 'comments'}</span>
                    </div>
                </div>
                {isPostCommentsOpen && (
                    <Comments
                        userProfilePost={userProfilePost}
                        isPostCommentsOpen={isPostCommentsOpen}
                        setDidPostComment={(value) => setDidPostComment(value)}
                        setDidDeleteComment={(value) => setDidDeleteComment(value)} />
                )}
            </div>
        </div>
    )
}
