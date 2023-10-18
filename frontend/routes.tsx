import Placeholder from 'Frontend/components/placeholder/Placeholder.js';
import AuthControl from 'Frontend/views/AuthControl.js';
import HelloWorldView from 'Frontend/views/helloworld/HelloWorldView.js';
import LoginView from 'Frontend/views/login/LoginView.js';
import RegisterView from 'Frontend/views/register/RegisterView.js';
import ForgottenPasswordView from 'Frontend/views/forgotten-password/ForgottenPasswordView.js';
import MainLayout from 'Frontend/views/MainLayout.js';
import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

const AboutView = lazy(async () => import('Frontend/views/about/AboutView.js'));

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
];

export default createBrowserRouter(routes);
