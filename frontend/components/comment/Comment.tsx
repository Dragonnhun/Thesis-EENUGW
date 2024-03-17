import 'themes/intertwine/components/comment.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import UserProfilePostComment from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePostComment';
import Pair from 'Frontend/generated/org/springframework/data/util/Pair';
import ReactionType from 'Frontend/generated/hu/eenugw/userprofilemanagement/constants/ReactionType';
import MenuBarHelpers from 'Frontend/helpers/menuBarHelpers';
import { DateTime } from 'luxon';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { TDate, format } from 'timeago.js';
import { useEffect, useState } from 'react';
import { useAuth } from 'Frontend/util/auth';
import { UserProfilePostCommentEndpoint } from 'Frontend/generated/endpoints';
import { Notification } from '@hilla/react-components/Notification.js';
import { MenuBar } from '@hilla/react-components/MenuBar.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Link } from 'react-router-dom';

export default function Comment({userProfileAndPostComment, setDidDeleteComment}: {userProfileAndPostComment?: Pair, setDidDeleteComment: (wasCommentDeleted: boolean) => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'comment';
    const reactionBlockName = `${blockName}-reaction`;
    const detailsBlockName = `${blockName}-details`;

    const { state } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [heartCount, setHeartCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isHearted, setIsHearted] = useState(false);
    const [creationDateLocal, setCreationDateLocal] = useState(DateTime.local().toISO() as string);

    const userProfile = userProfileAndPostComment?.first as UserProfile;
    const userProfilePostComment = userProfileAndPostComment?.second as UserProfilePostComment;

    useEffect(() => {
        setLikeCount(userProfilePostComment?.userProfileLikeIds?.length ?? 0);
        setHeartCount(userProfilePostComment?.userProfileHeartIds?.length ?? 0);
        setIsLiked(userProfilePostComment?.userProfileLikeIds?.includes(state.user?.userProfileId!) ?? false);
        setIsHearted(userProfilePostComment?.userProfileHeartIds?.includes(state.user?.userProfileId!) ?? false);

        const creationDateLocal = DateTime.fromISO(userProfilePostComment?.creationDateUtc as string, { zone: 'utc' }).setZone('local').toISO() as string;
        setCreationDateLocal(creationDateLocal);
    }, [state, userProfilePostComment]);

    const reactionHandler = async (reactionType: ReactionType) => {
        try {
            const result = await UserProfilePostCommentEndpoint.likeDislikeComment(userProfilePostComment?.id!, state.user?.userProfileId!, reactionType);

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
                    // User is hearting the comment, remove heart and add like.
                    setHeartCount(heartCount - 1);
                    setIsHearted(false);
                    setLikeCount(likeCount + 1);
                    setIsLiked(true);
                } else {
                    // User is liking the comment, toggle like.
                    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
                    setIsLiked(!isLiked);
                }
            } else if (reactionType === ReactionType.HEART) {
                if (isLiked) {
                    // User is liking the comment, remove like and add heart.
                    setLikeCount(likeCount - 1);
                    setIsLiked(false);
                    setHeartCount(heartCount + 1);
                    setIsHearted(true);
                } else {
                    // User is hearting the comment, toggle heart.
                    setHeartCount(isHearted ? heartCount - 1 : heartCount + 1);
                    setIsHearted(!isHearted);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const deleteCommentHandler = async (userProfilePostCommentId: string) => {
        const result = await UserProfilePostCommentEndpoint.deleteUserProfilePostCommentByUserProfilePostCommentId(userProfilePostCommentId);
        if (result) {
            setDidDeleteComment(true);
        }
    }

    return (
        <>
            <hr className={`${blockName}-line`} />
            <div className={blockName}>
                <Link className={`${blockName}-link`} to={'/profile/' + userProfile?.profileDisplayId}>
                    <Avatar
                        theme='xsmall'
                        className={`${blockName}-avatar`}
                        img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                        name='user-avatar' />
                </Link>
                <div className={detailsBlockName}>
                    <Link className={`${detailsBlockName}-link`} to={'/profile/' + userProfile?.profileDisplayId}>
                        <span className={`${detailsBlockName}-name`}>{userProfile?.fullName}</span>
                    </Link>
                    <p className={`${detailsBlockName}-comment`}>{userProfilePostComment?.comment}</p>
                    <div className={reactionBlockName}>
                        {likeCount >= heartCount ? (
                            <img
                                className={isLiked ? `${reactionBlockName}-like-icon active` : `${reactionBlockName}-like-icon`}
                                src='images/like.png'
                                onClick={() => reactionHandler(ReactionType.LIKE)}
                            />
                        ) : (
                            <img
                                className={isHearted ? `${reactionBlockName}-heart-icon active` : `${reactionBlockName}-heart-icon`}
                                src='images/heart.png'
                                onClick={() => reactionHandler(ReactionType.HEART)}
                            />
                        )}
                        {likeCount >= heartCount ? (
                            <img
                                className={isHearted ? `${reactionBlockName}-heart-icon active` : `${reactionBlockName}-heart-icon`}
                                src='images/heart.png'
                                onClick={() => reactionHandler(ReactionType.HEART)}
                            />
                        ) : (
                            <img
                                className={isLiked ? `${reactionBlockName}-like-icon active` : `${reactionBlockName}-like-icon`}
                                src='images/like.png'
                                onClick={() => reactionHandler(ReactionType.LIKE)}
                            />
                        )}
                        <span className={`${reactionBlockName}-like-counter`}>{likeCount + heartCount} {likeCount + heartCount <= 1 ? 'person likes it' : 'people like it'}</span>
                    </div>
                </div>
                <span className={`${blockName}-date`}>{format(creationDateLocal as TDate)}</span>
                {state.user?.userProfileId === userProfilePostComment?.userProfileId && (
                    <MenuBar
                        className={`${blockName}-details-menu-bar`}
                        items={
                            [
                                {
                                    component: MenuBarHelpers.renderMenuComponent(
                                        <Icon className={`${blockName}-details-menu-bar-icon fa fa-ellipsis-v`} />
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
                                deleteCommentHandler(userProfilePostComment?.id!);
                            }
                        }} />
                    )}
            </div>
        </>
    )
}
