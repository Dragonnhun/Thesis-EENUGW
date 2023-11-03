import { LoginI18n, LoginOverlay } from '@hilla/react-components/LoginOverlay.js';
import { login } from 'Frontend/auth.js';
import { AuthContext } from 'Frontend/useAuth.js';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

const loginI18nDefault: LoginI18n = {
  form: {
    title: 'Forgotten Password',
    username: 'Username / E-mail Address',
    password: 'Password',
    submit: 'Sign In',
    forgotPassword: 'Forgotten password',
  },
  header: { title: 'Welcome!', description: 'Please sign in using your credentials below. Not a user yet? Sign up!' },
  errorMessage: {
    title: 'Incorrect Username / E-mail Address or Password!',
    message: 'Check that you have entered the correct Username / E-mail Address and Password and try again.',
    username: 'Username / E-mail Address is required',
    password: 'Password is required',
  },
};

export default function ForgottenPasswordView() {
  const { state, authenticate } = useContext(AuthContext);
  const [hasError, setError] = useState<boolean>();
  const [url, setUrl] = useState<string>();

  if (state.user && url) {
    const path = new URL(url, document.baseURI).pathname;
    return <Navigate to={path} replace />;
  }

  return (
    <LoginOverlay
      opened={true}
      error={hasError}
      noForgotPassword={false}
      i18n={loginI18nDefault}
      onLogin={async ({ detail: { username, password } }) => {
        const { defaultUrl, error, redirectUrl } = await login(username, password, authenticate);

        if (error) {
          setError(true);
        } else {
          setUrl(redirectUrl ?? defaultUrl ?? '/');
        }
      }}
      onForgotPassword={(e) => {
        const path = new URL(url ?? '', document.baseURI).pathname;
        return <Navigate to={path} replace />;
      }}
    />
  );
}
