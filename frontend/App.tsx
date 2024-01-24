import router from 'Frontend/routes.js';
import React from 'react';
import { AuthProvider } from 'Frontend/util/auth.js';
import { RouterProvider } from 'react-router-dom';

export default function App() {
    return (
        <React.StrictMode>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </React.StrictMode>
    );
}
