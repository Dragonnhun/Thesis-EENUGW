import router from 'Frontend/routes.js';
import React from 'react';
import { AuthProvider } from 'Frontend/util/auth.js';
import { RouterProvider } from 'react-router-dom';

export default function App() {
    const environment = import.meta.env.VITE_SITE_ENVIRONMENT as string;

    return (
        <>
            {environment === 'DEVELOPMENT' ? (
                <React.StrictMode>
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                </React.StrictMode>
            ) : (
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            )}
        </>
    );
}
