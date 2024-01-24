import 'themes/intertwine/components/share.scss';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Button } from '@hilla/react-components/Button.js';
import { useAuth } from 'Frontend/util/auth';

export default function Share() {
    const blockName = 'share';
    const { state } = useAuth();
    const assetsFolder = import.meta.env.VITE_ASSETS_FOLDER;

    return (
        <div className={blockName}>
            <div className={`${blockName}-wrapper`}>
                <div className={`${blockName}-wrapper-top`}>
                    {state.user ? (
                        <>
                            <Avatar className={`${blockName}-wrapper-top-image`} theme="xsmall" img={assetsFolder + state.user?.userProfile?.profilePicturePath} name={state.user.username} />
                        </>
                    ) : null}
                    <input className={`${blockName}-wrapper-top-input`} type='text' placeholder={`What's on your mind?`} />
                </div>
                <hr className={`${blockName}-wrapper-line`} />
                <div className={`${blockName}-wrapper-bottom`}>
                    <div className={`${blockName}-wrapper-bottom-options`}>
                        <div className={`${blockName}-wrapper-bottom-options-item`}>
                            <Icon style={{color: 'tomato'}} className={`${blockName}-wrapper-bottom-options-item-icon fa fa-photo-film`} />
                            <span className={`${blockName}-wrapper-bottom-options-item-text`}>Photo or Video</span>
                        </div>
                        <div className={`${blockName}-wrapper-bottom-options-item`}>
                            <Icon style={{color: 'blue'}} className={`${blockName}-wrapper-bottom-options-item-icon fa fa-user-tag`} />
                            <span className={`${blockName}-wrapper-bottom-options-item-text`}>Tag</span>
                        </div>
                        <div className={`${blockName}-wrapper-bottom-options-item`}>
                            <Icon style={{color: 'green'}} className={`${blockName}-wrapper-bottom-options-item-icon fa fa-location-dot`} />
                            <span className={`${blockName}-wrapper-bottom-options-item-text`}>Location</span>
                        </div>
                        <div className={`${blockName}-wrapper-bottom-options-item`}>
                            <Icon style={{color: 'goldenrod'}} className={`${blockName}-wrapper-bottom-options-item-icon fa fa-smile`} />
                            <span className={`${blockName}-wrapper-bottom-options-item-text`}>Feelings</span>
                        </div>
                    </div>
                    <Button className={`${blockName}-wrapper-bottom-share-button`}>
                        Share
                    </Button>
                </div>
            </div>
        </div>
    )
}
