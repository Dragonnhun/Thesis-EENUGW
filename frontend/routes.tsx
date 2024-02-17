import MainLayout from 'Frontend/views/MainLayout.js';
import LoginView from 'Frontend/views/login/LoginView.js';
import LogoutView from './views/logout/LogoutView';
import RegisterView from 'Frontend/views/register/RegisterView';
import ForgottenPasswordView from 'Frontend/views/forgotten-password/ForgottenPasswordView';
import ResetForgottenPasswordView from 'Frontend/views/forgotten-password/ResetForgottenPasswordView';
import HomeView from 'Frontend/views/home/HomeView';
import ProfileView from 'Frontend/views/profile/ProfileView';
import MessengerView from './views/messenger/MessengerView';
import { protectRoutes } from '@hilla/react-auth';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

export const routes = protectRoutes([
    {
        element: <MainLayout />,
        handle: { title: 'Main' },
        children: [
            { path: '/', element: <HomeView />, handle: { title: 'Home', requiresLogin: true } },
            { path: '/profile/:profileDisplayId', element: <ProfileView />, handle: { title: 'Profile', requiresLogin: true } },
            { path: '/messenger', element: <MessengerView />, handle: { title: 'Messenger', requiresLogin: true } },
        ],
    },
    { path: '/login', element: <LoginView />, handle: { title: 'Log In', requiresLogin: false } },
    { path: '/logout', element: <LogoutView />, handle: { title: 'Log Out', requiresLogin: true } },
    { path: '/register', element: <RegisterView />, handle: { title: 'Register', requiresLogin: false } },
    { path: '/forgotten-password', element: <ForgottenPasswordView />, handle: { title: 'Forgotten Password', requiresLogin: false } },
    { path: '/reset-forgotten-password', element: <ResetForgottenPasswordView />, handle: { title: 'Reset Forgotten Password', requiresLogin: false } },
]) as RouteObject[];

export default createBrowserRouter(routes);
