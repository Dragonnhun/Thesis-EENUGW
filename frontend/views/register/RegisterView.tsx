import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'Frontend/useAuth.js';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from '@hilla/react-form';
import UserModel from 'Frontend/generated/hu/eenugw/data/entities/UserModel';
import { RouteEndpoint, SiteEndpoint, UserEndpoint } from 'Frontend/generated/endpoints';
import { Button } from '@hilla/react-components/Button.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { PasswordField } from '@hilla/react-components/PasswordField.js';
import { Notification } from '@hilla/react-components/Notification.js';
import 'themes/thesis-eenugw/components/register-form.scss';

export default function RegsiterView() {
  const blockName = 'register-form';

  const { state } = useContext(AuthContext);
  const [url, setUrl] = useState<string>();
  const [siteName, setSiteName] = useState<string>();
  const [verificationResult, setVerificationResult] = useState({ status: '', message: '' });

  // Get the value of a specific query parameter.
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verificationCode = searchParams.get('verification-code');

  useEffect(() => {
    async function fetchSiteName() {
      const name = await SiteEndpoint.getSiteName();

      setSiteName(name);
    }

    if (verificationCode) {
      async function verifyRegistration() {
        const result = await UserEndpoint.verifyRegistration(verificationCode!);

        setVerificationResult({ status: result.first as string, message: result.second as string });

        if ((result.first as string) === 'Success') {
          setTimeout(async function () {
            setUrl(await RouteEndpoint.getLoginUrl());
          }, 30000);
        }
      }

      verifyRegistration();
    }

    fetchSiteName();
  }, []);

  const { model, field, submit } = useForm(UserModel, {
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
              Notification.show('Registration was successful! Please, check your inbox and verify your E-mail Address!', {
                position: 'top-center',
                duration: 30000,
                theme: 'success',
              });

              setTimeout(async function () {
                setUrl(await RouteEndpoint.getLoginUrl());
              }, 30000);
            });
          }
        });
      });
    }
  });

  if (url || state.user) {
    const path = new URL(url ?? "/", document.baseURI).pathname;
    return <Navigate to={path} replace />;
  }

  if (verificationCode) {
    return (
      <div className={ `${ blockName }-container` }>
        <section className={ `${ blockName }-section` }>
          <div className={ `${ blockName }-header` }>
            <h1 className={ `${ blockName }-header-title` }>Welcome to { siteName }!</h1>
          </div>
          <section className={ `${ blockName }` }>
            <h2 className={ `${ blockName }-title` }>{ verificationResult.status }</h2>
            <h3 className={ `${ blockName }-title` }>{ verificationResult.message }</h3>
          </section>
          <Button
              className={ `${ blockName }-login-button` }
              title={'Login'}
              onClick={async () => {
                setUrl(await RouteEndpoint.getLoginUrl());
              }}
            >Log in here!</Button>
        </section>
      </div>
    );
  } else {
    return (
      <div className={ `${ blockName }-container` }>
        <section className={ `${ blockName }-section` }>
          <div className={ `${ blockName }-header` }>
            <h1 className={ `${ blockName }-header-title` }>Welcome to { siteName }!</h1>
            <p className={ `${ blockName }-header-description` }>Please register below.</p>
          </div>
          <section className={ `${ blockName }` }>
            <h2 className={ `${ blockName }-title` }>Register</h2>
            <TextField label='Username' { ...field(model.username) } />
            <TextField label='E-mail Address' { ...field(model.email) } />
            <PasswordField label='Password' { ...field( model.password) } />
            <Button theme='primary contained submit' title='Register' className={ `${ blockName }-register-button` } onClick={submit}>Register</Button>
          </section>
          <Button
              className={ `${ blockName }-login-button` }
              title={'Login'}
              onClick={async () => {
                setUrl(await RouteEndpoint.getLoginUrl());
              }}
            >Already a user? Log in here!</Button>
        </section>
      </div>
    );
  }
}
