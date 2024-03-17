import 'themes/intertwine/components/share.scss';
import ImageModel from 'Frontend/generated/hu/eenugw/core/models/ImageModel';
import ImageType from 'Frontend/generated/hu/eenugw/core/constants/ImageType';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import UserProfilePost from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePost';
import UserProfilePostModel from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfilePostModel';
import Pair from 'Frontend/generated/org/springframework/data/util/Pair';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { Notification } from '@hilla/react-components/Notification.js';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Button } from '@hilla/react-components/Button.js';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useRef, useState } from 'react';
import { FileEndpoint, LoggerEndpoint, UserProfileEndpoint, UserProfilePostEndpoint } from 'Frontend/generated/endpoints';
import { readAsDataURL } from 'promise-file-reader';
import { useNavigate, useParams } from 'react-router-dom';

export default function Share({posted}: {posted?: () => void}){
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;
    const blockName = 'share';

    const { state } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [file, setFile] = useState<File>(null!);

    const description = useRef<HTMLTextAreaElement>(undefined!);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        (async () => {
            const userProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(state.user?.userProfileId!);
            setUserProfile(userProfile);
        })();
    }, [state.user]);

    const createPost = async (post: UserProfilePost) => {
        try {
            const result = await UserProfilePostEndpoint.createUserProfilePost(post);

            if (result) {
                Notification.show('Post has been successfully created!', {
                    position: 'top-center',
                    duration: 2000,
                    theme: 'success',
                });

                if (params.profileDisplayId && posted) {
                    posted();

                    description.current.value = '';
                    setFile(null!);
                } else {
                    navigate(new URL(`profile/${userProfile?.profileDisplayId}`, document.baseURI).pathname);
                }
            }
        } catch (error) {
            console.error(error);
            await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
        }
    }

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        if (description.current?.value === '' && file === null) return;

        const post : UserProfilePost = UserProfilePostModel.createEmptyValue();

        post.description = description.current?.value!;
        post.userProfileId = userProfile?.id!;

        if (file) {
            try {
                let image = ImageModel.createEmptyValue();

                // Removing metadata from the image.
                image.extension = file.name.split('.').pop()!;
                image.base64 = (await readAsDataURL(file)).split(',')[1];
                image.imageType = ImageType.POST_PICTURE;

                const result = await FileEndpoint.uploadImage(image, image.imageType) as unknown as Pair;

                if (result.first) {
                    post.photoPath = 'images/post-pictures/' + result.second as string;

                    await createPost(post);
                }
            } catch (error) {
                console.error(error);
                await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
            }
        } else {
            await createPost(post);
        }
    }

    return (
        <div className={blockName}>
            <div className={`${blockName}-wrapper`}>
                <div className={`${blockName}-top`}>
                    <Avatar
                        className={`${blockName}-top-image`}
                        theme='xsmall'
                        img={userProfile?.profilePicturePath ? assetsFolder + userProfile?.profilePicturePath : 'images/no-profile-picture.png'}
                        name={userProfile?.fullName} />
                    <textarea ref={description} className={`${blockName}-top-input`} placeholder={`What's on your mind ${userProfile?.firstName}?`} />
                </div>
                <hr className={`${blockName}-line`} />
                {file && (
                    <div className={`${blockName}-bottom-image-container`}>
                        <img className={`${blockName}-bottom-image`} src={URL.createObjectURL(file)} alt='Selected file' />
                        <Icon icon='vaadin:trash' className={`${blockName}-bottom-image-remove-icon`} onClick={() => {
                            setFile(null!);

                            Notification.show('File has been removed!', {
                                position: 'top-center',
                                duration: 3000,
                            });
                        }} />
                    </div> 
                )}
                <div className={`${blockName}-bottom`}>
                    <div className={`${blockName}-bottom-options`}>
                        <label htmlFor='post-file' className={`${blockName}-bottom-options-item`}>
                            <Icon style={{color: 'tomato'}} className={`${blockName}-bottom-options-item-icon fa fa-photo-film`} />
                            <span className={`${blockName}-bottom-options-item-text`}>Photo or Video</span>
                            <input className={`${blockName}-bottom-options-item-upload`} type='file' id='post-file' accept='.png,.jpeg,.jpg' onChange={(event) => {
                                if (event.target.files) {
                                    setFile(event.target.files[0]);

                                    Notification.show('File ' + event.target.files[0].name + ' has been selected for post!', {
                                        position: 'top-center',
                                        duration: 3000,
                                    });
                                }
                            }} />
                        </label>
                        <div className={`${blockName}-bottom-options-item`}>
                            <Icon style={{color: 'blue'}} className={`${blockName}-bottom-options-item-icon fa fa-user-tag`} />
                            <span className={`${blockName}-bottom-options-item-text`}>Tag - WIP</span>
                        </div>
                        <div className={`${blockName}-bottom-options-item`}>
                            <Icon style={{color: 'green'}} className={`${blockName}-bottom-options-item-icon fa fa-location-dot`} />
                            <span className={`${blockName}-bottom-options-item-text`}>Location - WIP</span>
                        </div>
                        <div className={`${blockName}-bottom-options-item`}>
                            <Icon style={{color: 'goldenrod'}} className={`${blockName}-bottom-options-item-icon fa fa-smile`} />
                            <span className={`${blockName}-bottom-options-item-text`}>Feelings - WIP</span>
                        </div>
                    </div>
                    <Button theme='primary' onClick={submitHandler} className={`${blockName}-bottom-share-button`}>
                        Share
                    </Button>
                </div>
            </div>
        </div>
    )
}
