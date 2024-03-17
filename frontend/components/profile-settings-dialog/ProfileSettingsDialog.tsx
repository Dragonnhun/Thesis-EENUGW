import 'themes/intertwine/components/profile-settings-dialog.scss';
import UserProfileModel from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfileModel';
import RelationshipStatus from 'Frontend/generated/hu/eenugw/userprofilemanagement/constants/RelationshipStatus';
import StringHelpers from 'Frontend/helpers/stringHelpers';
import UserProfile from 'Frontend/generated/hu/eenugw/userprofilemanagement/models/UserProfile';
import ImageType from 'Frontend/generated/hu/eenugw/core/constants/ImageType';
import Pair from 'Frontend/generated/org/springframework/data/util/Pair';
import ImageModel from 'Frontend/generated/hu/eenugw/core/models/ImageModel';
import User from 'Frontend/generated/hu/eenugw/usermanagement/models/User';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useRef, useState } from 'react';
import { FileEndpoint, LoggerEndpoint, SiteEndpoint, UserEndpoint, UserProfileEndpoint } from 'Frontend/generated/endpoints';
import { useForm, useFormPart } from '@hilla/react-form';
import { TextField } from '@hilla/react-components/TextField.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { DatePicker } from '@hilla/react-components/DatePicker.js';
import { ComboBox } from '@hilla/react-components/ComboBox.js';
import { Upload, UploadElement } from '@hilla/react-components/Upload.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { readAsDataURL } from 'promise-file-reader';
import { useNavigate } from 'react-router-dom';
import { Past } from '@hilla/form';
import { Dialog } from '@hilla/react-components/Dialog.js';
import { Button } from '@hilla/react-components/Button.js';

export default function ProfileSettingsDialog(
    {isDialogOpen, setIsDialogOpen, isLoginDialog}:
        {isDialogOpen: boolean, setIsDialogOpen: (value: boolean) => void, isLoginDialog: boolean}) {
    const blockName = 'profile-settings-dialog';

    const { state } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
    const [profileImage, setProfileImage] = useState<File>(null!);
    const [coverImage, setCoverImage] = useState<File>(null!);
    const [didSubmit, setDidSubmit] = useState<boolean>(false);
    const [siteName, setSiteName] = useState<string>('');

    const profileImageRef = useRef<UploadElement>(undefined!);
    const coverImageRef = useRef<UploadElement>(undefined!);
    
    const navigate = useNavigate();

    const { model, field, read, submit } = useForm(UserProfileModel, {
        onSubmit: async (userProfileModel: UserProfile) => {
            try {
                if (profileImage) {
                    let image = ImageModel.createEmptyValue();

                    // Removing metadata from the image.
                    image.extension = profileImage.name.split('.').pop()!;
                    image.base64 = (await readAsDataURL(profileImage)).split(',')[1];
                    image.imageType = ImageType.PROFILE_PICTURE;

                    const result = await FileEndpoint.uploadImage(image, image.imageType) as unknown as Pair;

                    if (result.first) {
                        userProfileModel.profilePicturePath = 'images/profile-pictures/' + result.second as string;
                    }
                }

                if (coverImage) {
                    let image = ImageModel.createEmptyValue();

                    // Removing metadata from the image.
                    image.extension = coverImage.name.split('.').pop()!;
                    image.base64 = (await readAsDataURL(coverImage)).split(',')[1];
                    image.imageType = ImageType.COVER_PICTURE;

                    const result = await FileEndpoint.uploadImage(image, image.imageType) as unknown as Pair;

                    if (result.first) {
                        userProfileModel.coverPicturePath = 'images/cover-pictures/' + result.second as string;
                    }
                }

                if (!userProfileModel.birthDateUtc?.includes('T')) {
                    userProfileModel.birthDateUtc = userProfileModel.birthDateUtc + 'T00:00:00Z';
                }

                const profileUpdateResult = await UserProfileEndpoint.updateUserProfile(userProfileModel);

                if (profileUpdateResult) {
                    Notification.show('Profile has been successfully updated!', {
                        position: 'top-center',
                        duration: 2000,
                        theme: 'success',
                    });

                    if(isLoginDialog) {
                        const user = state.user as User;
                        user.isFirstLogin = false;

                        await UserEndpoint.updateUser(user);
                    }

                    if (isLoginDialog) {
                        setIsDialogOpen(false);
                        navigate(new URL('/', document.baseURI).pathname);
                    }

                    profileImageRef.current.files = [];
                    coverImageRef.current.files = [];

                    setIsDialogOpen(false);
                    setDidSubmit(true);
                    navigate(new URL('/profile/' + userProfile?.profileDisplayId, document.baseURI).pathname);
                }
            } catch (error) {
                if (profileImage) {
                    await FileEndpoint.deleteImage(userProfileModel.profilePicturePath.substring('images/profile-pictures/'.length), ImageType.PROFILE_PICTURE);
                }

                if (coverImage) {
                    await FileEndpoint.deleteImage(userProfileModel.coverPicturePath.substring('images/cover-pictures/'.length), ImageType.COVER_PICTURE);
                }

                console.error(error);
                await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);
            }                
        },
    });

    const cancelHandler = () => {
        if (isLoginDialog) {
            setIsDialogOpen(false);

            navigate(new URL('/logout', document.baseURI).pathname);
        }

        setIsDialogOpen(false);
    }

    const birthDateField = useFormPart(model.birthDateUtc);
    
    useEffect(() => {  
        (async () => {
            birthDateField.addValidator(
                new Past({
                    message: 'Please enter a valid date of birth',
                })
            );

            const siteName = await SiteEndpoint.getSiteName();
            setSiteName(siteName);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (state.user) {
                setTimeout(async () => {
                    const userProfile = await UserProfileEndpoint.getUserProfileByUserProfileId(state.user?.userProfileId!);
                    setUserProfile(userProfile);
                    
                    read(userProfile);
                    setDidSubmit(false);

                    birthDateField.setValue(userProfile?.birthDateUtc?.split('T')[0] ?? '');
                }, isLoginDialog ? 0 : 2000);
            }
        })();
    }, [state.user, didSubmit]);

    return (
        <Dialog
            headerTitle='Profile Settings'
            className={blockName}
            draggable={false}
            modeless={false}
            opened={isDialogOpen}
            onOpenedChanged={({ detail }) => {
                setIsDialogOpen(detail.value);
            }}
            footerRenderer={() =>
                <>
                    <Button className={`${blockName}-close-button mr-auto`} theme='tertiary' onClick={cancelHandler}>
                        Close
                    </Button>
                    <Button className={`${blockName}-save-button`} theme='primary' onClick={(event) => {
                        event.stopPropagation();
                        submit();
                    }}>
                        Save
                    </Button>
                </>
            }>
            <Icon icon='vaadin:close-small' className={`${blockName}-close-icon`} onClick={cancelHandler} />
            {isLoginDialog && <h6 className='pb-m'>Welcome to {siteName}! Before your first log in, please, fill in the form below!</h6>}
            <h6>Personal Information</h6>
            <TextField
                label='First Name'
                className='pr-s'
                clearButtonVisible={true}
                {...field(model.firstName)}>
                <Icon slot='prefix' icon='vaadin:user-card' />
            </TextField>
            <TextField
                label='Last Name'
                className='pl-s pr-s'
                clearButtonVisible={true}
                {...field(model.lastName)}>
                <Icon slot='prefix' icon='vaadin:user-card' />
            </TextField>
            <DatePicker
                label='Birth Date'
                className='pl-s'
                clearButtonVisible={true}
                {...field(model.birthDateUtc)}>
                <Icon slot='prefix' icon='vaadin:calendar' />
            </DatePicker>
            <h6 className='pt-m'>Profile Information</h6>
            <TextField
                label='Description'
                className='pr-s'
                clearButtonVisible={true}
                {...field(model.description)}>
                <Icon slot='prefix' icon='vaadin:clipboard-user' />
            </TextField>
            <TextField
                label='City'
                className='pl-s pr-s'
                clearButtonVisible={true}
                {...field(model.city)}>
                <Icon slot='prefix' icon='vaadin:building' />
            </TextField>
            <TextField
                label='Hometown'
                className='pl-s pr-s'
                clearButtonVisible={true}
                {...field(model.hometown)}>
                <Icon slot='prefix' icon='vaadin:building' />
            </TextField>
            <ComboBox
                label='Relationship Status'
                className='pl-s'
                clearButtonVisible={true}
                items={Object.values(RelationshipStatus).filter(value => value !== RelationshipStatus.NOT_SET).map((value) => ({label: StringHelpers.removeUnderscoresAndCapitalizeFirst(value as string), value}))}
                {...field(model.relationshipStatus)}>
                <Icon slot='prefix' icon='vaadin:user-heart' />
            </ComboBox>
            <h6 className='pt-m pb-m'>Profile and Cover Picture</h6>
            <div>
                <label htmlFor='profile-picture-upload'>Profile Picture</label>
                <Upload ref={profileImageRef} id='profile-picture-upload' accept='image/*' max-files='1' maxFileSize={5242880} onUploadBefore={(event) => {
                    event.preventDefault();
                    setProfileImage(event.detail.file);
                }} />
            </div>
            <div>
                <label htmlFor='cover-picture-upload'>Cover Picture</label>
                <Upload ref={coverImageRef} id='cover-picture-upload' accept='image/*' max-files='1' maxFileSize={5242880} onUploadBefore={(event) => {
                    event.preventDefault();
                    setCoverImage(event.detail.file);
                }} />
            </div>
        </Dialog>
    )
}
