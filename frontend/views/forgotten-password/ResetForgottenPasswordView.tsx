import 'themes/intertwine/views/reset-forgotten-password-form.scss';
import ForgottenPasswordView from 'Frontend/views/forgotten-password/ForgottenPasswordView';
import Pair from 'Frontend/generated/org/springframework/data/util/Pair';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@hilla/react-components/Button.js';
import { PasswordField } from '@hilla/react-components/PasswordField.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';

export default function ResetForgottenPasswordView() {
    const blockName = 'reset-forgotten-password-form';

    const { state } = useAuth();
    const [url, setUrl] = useState<string>();
    const [siteName, setSiteName] = useState<string>('');

    // Get the value of a specific query parameter.
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const forgottenPasswordToken = searchParams.get('token');

    useEffect(() => {
        (async () => {
            setSiteName(await SiteEndpoint.getSiteName());
        })();
    }, []);

    if (url || state.user) return <Navigate to={ new URL(url ?? "/", document.baseURI).pathname } />;

    const ResetForgottenPasswordView = () => {
        const [newPassword, setNewPassword] = useState<string>();
        const [repeatNewPassword, setRepeatNewPassword] = useState<string>();

        const submit = async function () {
            try {
                const user = await UserEndpoint.getUserByForgottenPasswordToken(forgottenPasswordToken!);
        
                if (user === undefined) {
                    Notification.show('User could not be found based on the provided forgotten password token!', {
                        position: 'top-center',
                        duration: 4000,
                        theme: 'error',
                    });
    
                    return;
                }
        
                var result = await UserEndpoint.resetForgottenPassword(forgottenPasswordToken!, newPassword!) as Pair;
        
                if (!(result.first as boolean)) {
                    Notification.show(result.second as string, {
                        position: 'top-center',
                        duration: 4000,
                        theme: 'error',
                    });
    
                    return;
                }
    
                Notification.show(
                    'Your password has been successfully changed! ' +
                    'You will be redirected to the log in page in 30 seconds.', {
                        position: 'top-center',
                        duration: 30000,
                        theme: 'success',
                    });
        
                setTimeout(async () => {
                    setUrl(await RouteEndpoint.getLoginUrl());
                }, 30000);
            } catch (error) {
                console.error(error);
    
                Notification.show('An error occurred while resetting the password.', {
                    position: 'top-center',
                    duration: 4000,
                    theme: 'error',
                });
            }
        };

        return (
            <div className={`${ blockName }-container`}>
                <section className={`${ blockName }-section`}>
                    <div className={`${ blockName }-header`}>
                        <h1 className={`${ blockName }-header-title`}>{siteName}</h1>
                        <p className={`${ blockName }-header-description`}>Please input the new password you wish to use.</p>
                    </div>
                    <section className={`${ blockName }`}>
                        <h2 className={`${ blockName }-title`}>Reset Forgotten Password</h2>
                        <PasswordField
                            allowedCharPattern="[A-Za-z0-9]"
                            label='New Password'
                            name='newPassword'
                            value={newPassword}
                            required={true}
                            clearButtonVisible={true}
                            onValueChanged={(event) => setNewPassword(event.detail.value)}>
                            <Icon slot="prefix" icon="vaadin:lock" />
                        </PasswordField>
                        <PasswordField
                            allowedCharPattern="[A-Za-z0-9]"
                            label='Repeat New Password'
                            name='repeatNewPassword'
                            value={repeatNewPassword}
                            required={true}
                            clearButtonVisible={true}
                            onValueChanged={(event) => setRepeatNewPassword(event.detail.value)}>
                            <Icon slot="prefix" icon="vaadin:lock" />
                        </PasswordField>
                        <Button 
                            disabled={newPassword != repeatNewPassword || newPassword == undefined || repeatNewPassword == undefined || newPassword.length < 8 || repeatNewPassword.length < 8}
                            onClick={submit}
                            theme='primary contained submit'
                            title='Reset Password'
                            className={`${ blockName }-change-password-button`}>
                            <Icon slot='prefix' icon='vaadin:paperplane' />
                            Change Password
                        </Button>
                    </section>
                    <Button
                        className={`${ blockName }-login-button`}
                        title='Login'
                        onClick={async () => {
                            setUrl(await RouteEndpoint.getLoginUrl());
                        }}>
                        <Icon slot='prefix' icon='vaadin:unlock' />
                        Log In
                    </Button>
                </section>
            </div>
        );
    }

    return (
        <>
            { forgottenPasswordToken ? <ResetForgottenPasswordView /> : <ForgottenPasswordView /> }
        </>
    )
}
