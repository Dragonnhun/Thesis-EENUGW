import 'themes/intertwine/views/register-form.scss';
import '@vaadin/icons';
import UserModel from 'Frontend/generated/hu/eenugw/usermanagement/models/UserModel';
import User from 'Frontend/generated/hu/eenugw/usermanagement/models/User';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from '@hilla/react-form';
import { Button } from '@hilla/react-components/Button.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { PasswordField } from '@hilla/react-components/PasswordField.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';

export default function RegisterView() {
    const blockName = 'register-form';
    
    const { state } = useAuth();
    const [url, setUrl] = useState<string>('');
    const [siteName, setSiteName] = useState<string>('');

    // Get the value of a specific query parameter.
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const registrationToken = searchParams.get('token');

    useEffect(() => {
        (async () => {
            setSiteName(await SiteEndpoint.getSiteName());
        })();
    }, []);

    if (url || state.user) return <Navigate to={ new URL(url ?? '/', document.baseURI).pathname } />;

    const VerifyView = () => {
        const [verificationResult, setVerificationResult] = useState({ status: '', message: '' });

        useEffect(() => {
            (async () => {
                try {
                    const user = await UserEndpoint.getUserByRegistrationToken(registrationToken!);
            
                    if (user === undefined) {
                        setVerificationResult({
                            status: 'Error',
                            message: 'User could not be found based on the provided registration token!',
                        });
    
                        return;
                    }
            
                    const result = await UserEndpoint.verifyRegistration(registrationToken!);
            
                    setVerificationResult({
                        status: result?.first as string,
                        message: result?.second as string,
                    });
            
                    if (verificationResult.status === 'Success') {
                        setTimeout(async () => {
                            setUrl(await RouteEndpoint.getLoginUrl());
                        }, 30000);
                    }
                } catch (error) {
                    console.error(error);
                    
                    setVerificationResult({
                        status: 'Error',
                        message: 'An error occurred while verifying registration.',
                    });
                }
            })();
        }, []);

        return (
            <div className={`${ blockName }-container`}>
                <section className={`${ blockName }-section`}>
                    <div className={`${ blockName }-header`}>
                        <h1 className={`${ blockName }-header-title`}>{siteName}</h1>
                    </div>
                    <section className={`${ blockName }`}>
                        <h2 className={`${ blockName }-title`}>{verificationResult.status}</h2>
                        <h3 className={`${ blockName }-title`}>{verificationResult.message}</h3>
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

    const RegisterView = () => {
        const { model, field, read, submit } = useForm(UserModel, {
            onSubmit: async (userModel: User) => {
                try {
                    let user = await UserEndpoint.getUserByUsername(userModel.username);
        
                    if (user !== undefined) {
                        Notification.show('Username already exists!', {
                            position: 'top-center',
                            duration: 2000,
                            theme: 'error',
                        });
    
                        return;
                    }
        
                    user = await UserEndpoint.getUserByEmail(userModel.email);
        
                    if (user !== undefined) {
                        Notification.show('E-mail Address already exists!', {
                            position: 'top-center',
                            duration: 2000,
                            theme: 'error',
                        });
    
                        return;
                    }

                    user = await UserEndpoint.registerUser(userModel);
        
                    if (user !== undefined) {
                        Notification.show(
                            'Registration was successful! ' +
                            'Please, check your inbox and verify your E-mail Address!' +
                            'You will be redirected to the log in page in 30 seconds.', {
                                position: 'top-center',
                                duration: 30000,
                                theme: 'success',
                            });
            
                        // Emptying the TextField and PasswordField values.
                        read(null);
            
                        setTimeout(async () => {
                            setUrl(await RouteEndpoint.getLoginUrl());
                        }, 30000);   
                    }
                } catch (error) {
                    console.error(error);
    
                    Notification.show('An error occurred during registration.', {
                        position: 'top-center',
                        duration: 2000,
                        theme: 'error',
                    });
                }
            },
        });

        return (
            <div className={`${ blockName }-container`}>
                <section className={`${ blockName }-section`}>
                    <div className={`${ blockName }-header`}>
                        <h1 className={`${ blockName }-header-title`}>{siteName}</h1>
                        <p className={`${ blockName }-header-description`}>Please register below and join our community.</p>
                    </div>
                    <section className={`${ blockName }`}>
                        <h2 className={`${ blockName }-title`}>Register</h2>
                        <TextField
                            label='Username'
                            helperText='Please specify the username you would like to use.'
                            clearButtonVisible={true}
                            {...field(model.username)}>
                            <Icon slot='prefix' icon='vaadin:user' />
                        </TextField>
                        <TextField
                            label='E-mail Address'
                            helperText='Please specify the E-mail Address you would like to use.'
                            clearButtonVisible={true}
                            {...field(model.email)}>
                            <Icon slot='prefix' icon='vaadin:envelope' />
                        </TextField>
                        <PasswordField
                            label='Password'
                            helperText='Please specify the password you would like to use.'
                            clearButtonVisible={true}
                            {...field(model.password)}>
                            <Icon slot='prefix' icon='vaadin:lock' />
                        </PasswordField>
                        <Button 
                            theme='primary contained submit'
                            title='Register'
                            className={`${ blockName }-register-button`}
                            onClick={(event) => {
                                event.stopPropagation();
                                
                                submit();
                            }}>
                            <Icon slot='prefix' icon='vaadin:paperplane' />
                            Register
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
            { registrationToken ? <VerifyView /> : <RegisterView /> }
        </>
    )
}
