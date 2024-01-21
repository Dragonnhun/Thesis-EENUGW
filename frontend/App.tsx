import router from 'Frontend/routes.js';
import React from 'react';
import { AuthContext, useAuth } from 'Frontend/useAuth.js';
import { RouterProvider } from 'react-router-dom';

export default function App() {
    const auth = useAuth();
    
    return (
        <React.StrictMode>
          <AuthContext.Provider value={auth}>
            <RouterProvider router={router} />
          </AuthContext.Provider>
        </React.StrictMode>
    );
}
