import { LoginI18n, LoginForm } from '@hilla/react-components/LoginForm.js';
import { login } from 'Frontend/auth.js';
import { AuthContext } from 'Frontend/useAuth.js';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteEndpoint, SiteEndpoint } from 'Frontend/generated/endpoints';
import { Button } from '@hilla/react-components/Button.js';
import 'themes/thesis-eenugw/components/login-form.scss';

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
  const [hasError, setError] = useState<boolean>();
  const [url, setUrl] = useState<string>();
  const [siteName, setSiteName] = useState<string>();
  
  useEffect(() => {
    async function fetchSiteName() {
      const siteName = await SiteEndpoint.getSiteName();

      setSiteName(siteName);
    }

    fetchSiteName();
  }, []);

  if (url || state.user) {
    const path = new URL(url ?? "/", document.baseURI).pathname;
    return <Navigate to={path} replace />;
  }

  return (
    <div className={ `${ blockName }-container` }>
      <section className={ `${ blockName }-section` }>
        <div className={ `${ blockName }-header` }>
          <h1 className={ `${ blockName }-header-title` }>Welcome to { siteName }!</h1>
          <p className={ `${ blockName }-header-description` }>Please log in using your credentials below.</p>
        </div>
        <LoginForm
          className={ blockName }
          title='Log In'
          error={ hasError }
          i18n={ loginI18nDefault }
          noForgotPassword={ true }
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
          className={ `${ blockName }-register-button` }
          title={'Register'}
          onClick={async () => {
            setUrl(await RouteEndpoint.getRegisterUrl());
          }}
        >Not a user yet? Register here!</Button>
        <Button
          className={ `${ blockName }-forgotten-password-button` }
          title={'Forgotten Password'}
          onClick={async () => {
            setUrl(await RouteEndpoint.getForgottenPasswordUrl());
          }}
        >Forgot your password? Recover here!</Button>
      </section>
    </div>
  );
}
