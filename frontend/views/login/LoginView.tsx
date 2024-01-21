import 'themes/intertwine/views/login-form.scss';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginI18n, LoginForm } from '@hilla/react-components/LoginForm.js';
import { Button } from '@hilla/react-components/Button.js';
import { Icon } from '@hilla/react-components/Icon.js';
import { login } from 'Frontend/auth.js';
import { AuthContext } from 'Frontend/useAuth.js';
import { RouteEndpoint, SiteEndpoint } from 'Frontend/generated/endpoints';

const loginI18nDefault: LoginI18n = {
  form: {
    title: 'Log In',
    username: 'Username',
    password: 'Password',
    submit: 'Log In',
    forgotPassword: 'Forgotten Password',
  },
  errorMessage: {
    title: 'Incorrect Username or Password!',
    message: 'Check that you have entered the correct Username and Password and try again.',
    username: 'Username is required.',
    password: 'Password is required.',
  },
};

export default function LoginView() {
  const blockName = 'login-form';

  const { state, authenticate } = useContext(AuthContext);
  const [url, setUrl] = useState<string>();
  const [hasError, setError] = useState<boolean>();
  const [siteName, setSiteName] = useState<string>('');
  
  useEffect(() => {
    async function fetchSiteName() {
      const siteName = await SiteEndpoint.getSiteName();

      setSiteName(siteName);
    }

    fetchSiteName();
  }, []);

  if (url || state.user) return <Navigate to={ new URL(url ?? '/', document.baseURI).pathname } />;

  return (
    <div className={`${ blockName }-container`}>
      <section className={`${ blockName }-section`}>
        <div className={`${ blockName }-header`}>
          <h1 className={`${ blockName }-header-title`}>{siteName}</h1>
          <p className={`${ blockName }-header-description`}>Please log in using your credentials below.</p>
        </div>
        <LoginForm
          className={blockName}
          title='Log In'
          error={hasError}
          i18n={loginI18nDefault}
          noForgotPassword={true}
          onLogin={async ({ detail: { username, password } }) => {
            const { defaultUrl, error, redirectUrl } = await login(username, password, authenticate);

            if (error) {
              setError(true);
            } else {
              setUrl(redirectUrl ?? defaultUrl ?? '/');
            }
          }}
        />
        <Button
          className={`${ blockName }-register-button`}
          title='Register'
          onClick={async () => {
            setUrl(await RouteEndpoint.getRegisterUrl());
          }}>
          <Icon slot='prefix' className='fa fa-user-plus' />
          Register
        </Button>
        <Button
          className={`${ blockName }-forgotten-password-button`}
          title='Forgotten Password'
          onClick={async () => {
            setUrl(await RouteEndpoint.getForgottenPasswordUrl());
          }}>
          <Icon slot='prefix' className='fa fa-rotate-left' />
          Forgotten Password
        </Button>
      </section>
    </div>
  );
}
