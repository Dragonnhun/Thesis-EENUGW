import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@hilla/react-components/Button.js';
import { PasswordField } from '@hilla/react-components/PasswordField.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { AuthContext } from 'Frontend/useAuth.js';
import { RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import 'themes/thesis-eenugw/components/reset-forgotten-password-form.scss';
import '@vaadin/icons';

export default function ResetForgottenPasswordView() {
  const blockName = 'reset-forgotten-password-form';

  const { state } = useContext(AuthContext);
  const [url, setUrl] = useState<string>();
  const [siteName, setSiteName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>();
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>();

  // Get the value of a specific query parameter.
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const forgottenPasswordToken = searchParams.get('token');

  useEffect(() => {
    async function fetchSiteName() {
      const name = await SiteEndpoint.getSiteName();

      setSiteName(name);
    }

    fetchSiteName();
  }, []);

  const submit = async function () {
    UserEndpoint.getByForgottenPasswordToken(forgottenPasswordToken!).then((result) => {
      if (result === undefined) {
        Notification.show('User could not be found based on the provided forgotten password token!', {
          position: 'top-center',
          duration: 4000,
          theme: 'error',
        });
        
        return;
      } 

      UserEndpoint.resetForgottenPassword(forgottenPasswordToken!, newPassword!).then(() => {
        Notification.show(
          'Your password has been successfully changed! ' + 
          'You will be redirected to the log in page in 30 seconds.', {
          position: 'top-center',
          duration: 30000,
          theme: 'success',
        });

        setTimeout(async function () {
          setUrl(await RouteEndpoint.getLoginUrl());
        }, 30000);
      });
    });
  }

  if (url || state.user) return <Navigate to={ new URL(url ?? "/", document.baseURI).pathname } />;

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
              disabled={newPassword != repeatNewPassword || newPassword == undefined || repeatNewPassword == undefined}
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
