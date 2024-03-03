import '@vaadin/icons';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import Placeholder from 'Frontend/components/placeholder/Placeholder';
import Navbar from 'Frontend/components/navbar/Navbar';
import { AppLayout } from '@hilla/react-components/AppLayout.js';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {    
    return (
        <div className='app-layout-container'>
            <AppLayout className='main-layout' primarySection='navbar'>
                <Navbar />
                <Suspense fallback={<Placeholder />}>
                    <Outlet />
                </Suspense>
            </AppLayout>
        </div>
    );
}
