import 'themes/intertwine/components/post.scss';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/entities/UserProfilePost';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { useState } from 'react';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/entities/UserProfile';
import User from 'Frontend/generated/hu/eenugw/usermanagement/entities/User';
import { TDate, format } from 'timeago.js';

export default function Post({post}: {post: UserProfilePost | null}) {
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const [like, setLike] = useState(post?.likeCount ?? 0);
    const [heart, setHeart] = useState(post?.heartCount ?? 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isHearted, setIsHearted] = useState(false);
    const [canLike, setCanLike] = useState(true);
    const [canHeart, setCanHeart] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(post?.userProfile ?? null);
    const [user, setUser] = useState<User | null>(userProfile?.user ?? null);
    const [numberOfComments, setNumberOfComments] = useState(post?.userProfileComments?.length ?? 0);

    const likeHandler = () => {
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    }

    const heartHandler = () => {
        setHeart(isHearted ? heart - 1 : heart + 1);
        setIsHearted(!isHearted);
    }

    return (
        <div className='post'>
            <div className='post-wrapper'>
                <div className='post-top'>
                    <div className='post-top-left'>
                        <Avatar theme='xsmall' className='post-top-left-image' img={userProfile?.profilePicturePath == undefined ? 'images/no-profile-picture.png' : assetsFolder + userProfile?.profilePicturePath} name='friend-avatar' />
                        <span className='post-top-left-username'>{user?.username}</span>
                        <span className='post-top-left-date'>{format(post?.creationDateUtc as TDate)}</span>
                    </div>
                    <div className='post-top-right'>
                        <Icon className='post-top-right-icon fa fa-ellipsis-h' />
                    </div>
                </div>
                <div className='post-center'>
                    <span className='post-center-text'>{post?.description}</span>
                    <img className='post-center-image' src={assetsFolder + post?.photoPath} />
                </div>
                <div className='post-bottom'>
                    <div className='post-bottom-left'>
                        <img className='post-bottom-left-like-icon' src='images/like.png' onClick={likeHandler} />
                        <img className='post-bottom-left-heart-icon' src='images/heart.png' onClick={heartHandler} />
                        <span className='post-bottom-left-like-counter'>{like + heart} {like + heart <= 1 ? 'person likes it' : 'people like it'}</span>
                    </div>
                    <div className='post-bottom-right'>
                        <span className="post-bottom-right-comment-text">{numberOfComments} {numberOfComments <= 1 ? 'comment' : 'comments'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
