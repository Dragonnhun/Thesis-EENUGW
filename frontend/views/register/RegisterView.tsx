import UserModel from 'Frontend/generated/hu/eenugw/usermanagement/entities/UserModel';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from '@hilla/react-form';
import { Button } from '@hilla/react-components/Button.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { PasswordField } from '@hilla/react-components/PasswordField.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { AuthContext } from 'Frontend/useAuth.js';
import { RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import 'themes/intertwine/components/register-form.scss';
import '@vaadin/icons';

export default function RegsiterView() {
  const blockName = 'register-form';

  const { state } = useContext(AuthContext);
  const [url, setUrl] = useState<string>();
  const [siteName, setSiteName] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState({ status: '', message: '' });

  // Get the value of a specific query parameter.
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const registrationToken = searchParams.get('token');

  useEffect(() => {
    async function fetchSiteName() {
      const name = await SiteEndpoint.getSiteName();

      setSiteName(name);
    }

    if (registrationToken) {
      async function verifyRegistration() {
        const result = await UserEndpoint.verifyRegistration(registrationToken!);

        setVerificationResult({ status: result?.first as string, message: result?.second as string });

        if ((result?.first as string) === 'Success') {
          setTimeout(async function () {
            setUrl(await RouteEndpoint.getLoginUrl());
          }, 30000);
        }
      }

      verifyRegistration();
    }

    fetchSiteName();
  }, []);

  const { model, field, read, submit } = useForm(UserModel, {
    onSubmit: async (user) => {
      UserEndpoint.getByUsername(user.username).then((result) => {
        if (result !== undefined) {
          Notification.show('Username already exists!', {
            position: 'top-center',
            duration: 2000,
            theme: 'error',
          });

          return;
        }

        UserEndpoint.getByEmail(user.email).then((result) => {
          if (result !== undefined) {
            Notification.show('E-mail Address already exists!', {
              position: 'top-center',
              duration: 2000,
              theme: 'error',
            });
    
            return;
          } else {
            UserEndpoint.register(user).then(() => {
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

              setTimeout(async function () {
                setUrl(await RouteEndpoint.getLoginUrl());
              }, 30000);
            });
          }
        });
      });
    }
  });

  if (url || state.user) return <Navigate to={ new URL(url ?? '/', document.baseURI).pathname } />;

  if (registrationToken) {
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
  } else {
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
              {...field( model.password)}>
              <Icon slot='prefix' icon='vaadin:lock' />
            </PasswordField>
            <Button 
              theme='primary contained submit'
              title='Register'
              className={`${ blockName }-register-button`}
              onClick={submit}>
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
}
