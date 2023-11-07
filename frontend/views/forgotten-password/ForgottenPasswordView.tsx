import validator from "validator";
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@hilla/react-components/Button.js';
import { EmailField } from '@hilla/react-components/EmailField.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { AuthContext } from 'Frontend/useAuth.js';
import { RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import 'themes/thesis-eenugw/components/forgotten-password-form.scss';

export default function ForgottenPasswordView() {
  const blockName = 'forgotten-password-form';

  const { state } = useContext(AuthContext);
  const [siteName, setSiteName] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchSiteName() {
      const name = await SiteEndpoint.getSiteName();

      setSiteName(name);
    }

    fetchSiteName();
  }, []);

  const submit = async function () {
    UserEndpoint.getByEmail(email).then((result) => {
      if (result === undefined) {
        Notification.show('E-mail Address has not been registered yet!', {
          position: 'top-center',
          duration: 2000,
          theme: 'error',
        });

        return;
      } 

      UserEndpoint.hasForgottenPasswordResetAlreadyBeenRequestedForEmail(email).then((result) => {
        if (result) {
          Notification.show('Changing forgotten password has already been requested for the provided E-mail Address!', {
            position: 'top-center',
            duration: 4000,
            theme: 'error',
          });

          return;
        }

        UserEndpoint.requestResettingForgottenPassword(email).then(() => {
          Notification.show(
            'Your request to reset your password has been successful! ' + 
            'You will not be able to log in to the site until your password is renewed. ' + 
            'Please, check your inbox and continue with the steps specified in the E-mail!' +
            '<br>You will be redirected to the log in page in 30 seconds.', {
            position: 'top-center',
            duration: 30000,
            theme: 'success',
          });
  
          setTimeout(async function () {
            setUrl(await RouteEndpoint.getLoginUrl());
          }, 30000);
        });
      });
    });
  }

  if (url || state.user) return <Navigate to={ new URL(url ?? "/", document.baseURI).pathname } />;

  return (
    <div className={ `${ blockName }-container` }>
        <section className={ `${ blockName }-section` }>
          <div className={ `${ blockName }-header` }>
            <h1 className={ `${ blockName }-header-title` }>{ siteName }</h1>
            <p className={ `${ blockName }-header-description` }>Please provide your E-mail Address to which you want to reset your password below.</p>
          </div>
          <section className={ `${ blockName }` }>
            <h2 className={ `${ blockName }-title` }>Forgotten Password</h2>
            <EmailField
              label='E-mail Address'
              name='email'
              value={ email }
              errorMessage='Please enter a valid E-mail Address!'
              required={ true }
              clearButtonVisible={ true }
              onValueChanged={ (event) => setEmail(event.detail.value) }
            />
            <Button disabled={!validator.isEmail(email)} onClick={submit} theme='primary contained submit' title='Reset Password' className={ `${ blockName }-request-button` }>Request</Button>
          </section>
          <Button
            className={ `${ blockName }-login-button` }
            title={'Login'}
            onClick={async () => {
              setUrl(await RouteEndpoint.getLoginUrl());
            }}
          >Log In</Button>
      </section>
    </div>
  );
}
