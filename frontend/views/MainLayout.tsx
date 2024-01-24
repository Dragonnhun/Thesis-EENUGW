import '@vaadin/icons';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import Placeholder from 'Frontend/components/placeholder/Placeholder';
import Navbar from 'Frontend/components/navbar/Navbar';
import { AppLayout } from '@hilla/react-components/AppLayout.js';
import { useRouteMetadata } from 'Frontend/util/routing';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'Frontend/util/auth';

const navLinkClasses = ({ isActive }: any) => {
    return `block rounded-m p-s ${isActive ? 'bg-primary-10 text-primary' : 'text-body'}`;
};

export default function MainLayout() {
    const currentTitle = useRouteMetadata()?.title ?? 'InterTwine';
    const { state } = useAuth();
    
    return (
        <div className='app-layout-container'>
            <AppLayout primarySection='navbar' className='main-layout'>
                <Navbar />
                <Suspense fallback={<Placeholder />}>
                    <Outlet />
                </Suspense>
            </AppLayout>
        </div>
    );
}
