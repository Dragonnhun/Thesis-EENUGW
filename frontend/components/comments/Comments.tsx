import 'themes/intertwine/components/comments.scss';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import UserProfilePostComment from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePostComment';
import UserProfilePostCommentModel from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePostCommentModel';
import Pair from 'Frontend/generated/org/springframework/data/util/Pair';
import Comment from 'Frontend/components/comment/Comment';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePost';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Button } from '@hilla/react-components/Button.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { UserProfileEndpoint, UserProfilePostCommentEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useRef, useState } from 'react';

export default function Comments(
    {userProfilePost, isPostCommentsOpen, setDidPostComment, setDidDeleteComment}:
        {userProfilePost?: UserProfilePost, isPostCommentsOpen?: boolean, setDidPostComment: (wasCommentPosted: boolean) => void, setDidDeleteComment: (wasCommentDeleted: boolean) => void}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'comments';
    
    const { state } = useAuth();
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | undefined>();
    const [userProfilesAndPostComments, setUserProfilesAndPostComments] = useState<Pair[]>();
    const [didPostComment, setDidPostCommentInner] = useState(false);
    const [didDeleteComment, setDidDeleteCommentInner] = useState(false);

    const commentRef = useRef<HTMLTextAreaElement>(undefined!);

    useEffect(() => {
        (async () => {
            const currentUserProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(state.user?.userProfileId!);
            setCurrentUserProfile(currentUserProfile);
        })();
    }, [state]);

    // const orderComments = (commentA: { second: UserProfilePostComment; }, commentB: { second: UserProfilePostComment; }) => {
    //     const totalLikesAndHeartsA = (commentA.second as UserProfilePostComment).userProfileLikeIds.length + (commentA.second as UserProfilePostComment).userProfileHeartIds.length;
    //     const totalLikesAndHeartsB = (commentB.second as UserProfilePostComment).userProfileLikeIds.length + (commentB.second as UserProfilePostComment).userProfileHeartIds.length;

    //     const likesAndHeartsDiff = totalLikesAndHeartsB - totalLikesAndHeartsA;

    //     if (likesAndHeartsDiff !== 0) {
    //         return likesAndHeartsDiff; // If likes and hearts count is different, return the comparison result.
    //     } else {
    //         // If likes and hearts count is the same, sort by creation date.
    //         return new Date((commentB.second as UserProfilePostComment).creationDateUtc).getTime() - new Date((commentA.second as UserProfilePostComment).creationDateUtc).getTime();
    //     }
    // };

    useEffect(() => {
        (async () => {
            const userProfilesAndPostComments = await UserProfilePostCommentEndpoint.getUserProfilesAndUserProfilePostCommentsByUserProfilePostId(userProfilePost?.id!);
            setUserProfilesAndPostComments(userProfilesAndPostComments
                .sort((commentA, commentB) => {
                    // // Check if commentA is the user's own comment
                    // if ((commentA.second as UserProfilePostComment).userProfileId === state.user?.userProfileId!) {
                    //     return -1 + orderComments(commentA, commentB); // Move user's own comment to the top
                    // }
                    // // Check if commentB is the user's own comment
                    // if ((commentB.second as UserProfilePostComment).userProfileId === state.user?.userProfileId!) {
                    //     return 1 - orderComments(commentA, commentB); // Move user's own comment to the top
                    // }

                    const userId = state.user?.userProfileId;
                
                    const isCurrentUserCommentA = (commentA.second as UserProfilePostComment).userProfileId === userId;
                    const isCurrentUserCommentB = (commentB.second as UserProfilePostComment).userProfileId === userId;
                
                    // Check if both comments are from the current user
                    if (isCurrentUserCommentA && isCurrentUserCommentB) {
                        // Sort by likes count if both comments are from the current user
                        const totalLikesAndHeartsA = (commentA.second as UserProfilePostComment).userProfileLikeIds.length + (commentA.second as UserProfilePostComment).userProfileHeartIds.length;
                        const totalLikesAndHeartsB = (commentB.second as UserProfilePostComment).userProfileLikeIds.length + (commentB.second as UserProfilePostComment).userProfileHeartIds.length;
                        const likesAndHeartsDiff = totalLikesAndHeartsB - totalLikesAndHeartsA;
                        
                        if (likesAndHeartsDiff !== 0) {
                            return likesAndHeartsDiff;
                        } else {
                            // If likes and hearts count is the same, sort by creation date
                            return new Date((commentB.second as UserProfilePostComment).creationDateUtc).getTime() - new Date((commentA.second as UserProfilePostComment).creationDateUtc).getTime();
                        }
                    } else if (isCurrentUserCommentA) {
                        // Move current user's comment to the top
                        return -1;
                    } else if (isCurrentUserCommentB) {
                        // Move current user's comment to the top
                        return 1;
                    } else {
                        // Sort by likes count if both comments are not from the current user
                        const totalLikesAndHeartsA = (commentA.second as UserProfilePostComment).userProfileLikeIds.length + (commentA.second as UserProfilePostComment).userProfileHeartIds.length;
                        const totalLikesAndHeartsB = (commentB.second as UserProfilePostComment).userProfileLikeIds.length + (commentB.second as UserProfilePostComment).userProfileHeartIds.length;
                        const likesAndHeartsDiff = totalLikesAndHeartsB - totalLikesAndHeartsA;
                
                        if (likesAndHeartsDiff !== 0) {
                            return likesAndHeartsDiff;
                        } else {
                            // If likes and hearts count is the same, sort by creation date
                            return new Date((commentB.second as UserProfilePostComment).creationDateUtc).getTime() - new Date((commentA.second as UserProfilePostComment).creationDateUtc).getTime();
                        }
                    }
                })
            );

            setDidPostComment(false);
            setDidPostCommentInner(false);
            setDidDeleteComment(false);
            setDidDeleteCommentInner(false);
        })();
    }, [isPostCommentsOpen, didPostComment, didDeleteComment]);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        if (commentRef.current?.value === '') return;

        const comment : UserProfilePostComment = UserProfilePostCommentModel.createEmptyValue();

        comment.comment = commentRef.current?.value!;
        comment.userProfileId = currentUserProfile?.id!;
        comment.userProfilePostId = userProfilePost?.id!;

        try {
            const result = await UserProfilePostCommentEndpoint.createUserProfilePostComment(comment);

            if (result) {
                Notification.show('Comment has been successfully created!', {
                    position: 'top-center',
                    duration: 2000,
                    theme: 'success',
                });
            }
            else {
                Notification.show('Comment could not be created!', {
                    position: 'top-center',
                    duration: 2000,
                    theme: 'error',
                });
            }

            setDidPostComment(true);
            setDidPostCommentInner(true);
            commentRef.current.value = '';
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <hr className={`${blockName}-line`} />
            <div className={blockName}>
                <div className={`${blockName}-add-comment`}>
                    <Avatar
                        theme='xsmall'
                        className={`${blockName}-add-comment-avatar`}
                        img={currentUserProfile?.profilePicturePath ? assetsFolder + currentUserProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                        name='current-user-avatar' />
                    <textarea
                        className={`${blockName}-add-comment-input`}
                        placeholder='Write something...'
                        ref={commentRef} />
                    <Button className={`${blockName}-send-button`} theme='primary' onClick={submitHandler}>Send</Button>
                </div>
                {userProfilesAndPostComments && userProfilesAndPostComments.map((userProfileAndPostComment) => (
                    <Comment key={(userProfileAndPostComment.second as UserProfilePostComment).id} userProfileAndPostComment={userProfileAndPostComment} setDidDeleteComment={(value) => {
                        setDidDeleteComment(value);
                        setDidDeleteCommentInner(value);
                    }} />
                ))}
            </div>
        </>
    )
}
