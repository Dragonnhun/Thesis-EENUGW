import 'themes/intertwine/views/forgotten-password-form.scss';
import validator from 'validator';
import Pair from 'Frontend/generated/org/springframework/data/util/Pair';
import LogType from 'Frontend/generated/hu/eenugw/core/constants/LogType';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@hilla/react-components/Button.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { EmailField } from '@hilla/react-components/EmailField.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { LoggerEndpoint, RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';
import { StringModel } from '@hilla/form';
import { useForm } from '@hilla/react-form';

// TODO: Do not re-render the component when typing in the E-mail Address field.
export default function ForgottenPasswordView() {
    const blockName = 'forgotten-password-form';
    
    const { state } = useAuth();
    const [url, setUrl] = useState<string>();
    const [siteName, setSiteName] = useState<string>('');

    useEffect(() => {
        (async () => {
            setSiteName(await SiteEndpoint.getSiteName());
        })();
    }, []);

    const { model, field, read, submit } = useForm(StringModel, {
        onSubmit: async (email) => {
            try {
                const user = await UserEndpoint.getUserByEmail(email);
        
                if (user === undefined) {
                    Notification.show('E-mail Address has not been registered yet!', {
                        position: 'top-center',
                        duration: 2000,
                        theme: 'error',
                    });
    
                    return;
                }
        
                const hasResetAlreadyBeenRequested = await UserEndpoint.hasForgottenPasswordResetAlreadyBeenRequestedForEmail(email);
        
                if (hasResetAlreadyBeenRequested) {
                    Notification.show('Changing forgotten password has already been requested for the provided E-mail Address!', {
                        position: 'top-center',
                        duration: 4000,
                        theme: 'error',
                    });
    
                    return;
                }
        
                const result = await UserEndpoint.requestResettingForgottenPassword(email) as Pair;
        
                if (!(result.first as boolean)) {
                    Notification.show(result.second as string, {
                        position: 'top-center',
                        duration: 4000,
                        theme: 'error',
                    });
    
                    return;
                }
        
                Notification.show(
                    'Your request to reset your password has been successful! ' +
                    'You will not be able to log in to the site until your password is renewed. ' +
                    'Please, check your inbox and continue with the steps specified in the E-mail! ' +
                    'You will be redirected to the log in page in 30 seconds.', {
                    position: 'top-center',
                    duration: 30000,
                    theme: 'success',
                });
        
                // Emptying the TextField and PasswordField values.
                read(null);

                setTimeout(async function () {
                    setUrl(await RouteEndpoint.getLoginUrl());
                }, 30000);
            } catch (error) {
                console.error(error);
                await LoggerEndpoint.log((error as Error).stack!, LogType.ERROR);

                Notification.show('An error occurred while requesting resetting forgotten password!', {
                    position: 'top-center',
                    duration: 4000,
                    theme: 'error',
                });
            }
        }
    });

    if (url || state.user) return <Navigate to={ new URL(url ?? '/', document.baseURI).pathname } />;

    return (
        <div className={`${ blockName }-container`}>
            <section className={`${ blockName }-section`}>
                <div className={`${ blockName }-header`}>
                    <h1 className={`${ blockName }-header-title`}>{siteName}</h1>
                    <p className={`${ blockName }-header-description`}>Please specify the E-mail Address associated with the account for which you would like to reset the password.</p>
                </div>
                <section className={`${ blockName }`}>
                    <h2 className={`${ blockName }-title`}>Forgotten Password</h2>
                    <EmailField
                        label='E-mail Address'
                        {...field(model)}
                        errorMessage='Please enter a valid E-mail Address!'
                        required={true}
                        clearButtonVisible={true}>
                        <Icon slot='prefix' icon='vaadin:envelope' />
                    </EmailField>
                    <Button 
                        disabled={!validator.isEmail(model.toString())}
                        onClick={submit}
                        theme='primary contained submit'
                        title='Request Resetting Password'
                        className={`${ blockName }-request-button`}>
                        <Icon slot='prefix' icon='vaadin:paperplane' />
                        Reset Password
                    </Button>
                </section>
                <Button
                    className={`${ blockName }-login-button`}
                    title='Log In'
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
