import Placeholder from 'Frontend/components/placeholder/Placeholder.js';
import AuthControl from 'Frontend/views/AuthControl.js';
import HelloWorldView from 'Frontend/views/helloworld/HelloWorldView.js';
import MainLayout from 'Frontend/views/MainLayout.js';
import LoginView from 'Frontend/views/login/LoginView.js';
import RegisterView from 'Frontend/views/register/RegisterView';
import ForgottenPasswordView from 'Frontend/views/forgotten-password/ForgottenPasswordView';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    element: (
      <AuthControl fallback={<Placeholder />}>
        <MainLayout />
      </AuthControl>
    ),
    handle: { title: 'Main' },
    children: [
    ],
  },
  { path: "/login", element: <LoginView />, handle: { title: 'Log In', requiresLogin: false } },
  { path: '/register', element: <RegisterView />, handle: { title: 'Register', requiresLogin: false } },
  { path: '/forgotten-password', element: <ForgottenPasswordView />, handle: { title: 'Forgotten Password', requiresLogin: false } },
];

export default createBrowserRouter(routes);
