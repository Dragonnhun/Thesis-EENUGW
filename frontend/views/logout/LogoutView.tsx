import 'themes/intertwine/views/logout.scss';
import { useAuth } from 'Frontend/util/auth';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '@hilla/react-components/ProgressBar.js';
import { Socket, io } from 'socket.io-client';

export default function LogoutView() {
    const blockName = 'logout';
    const { state, logout } = useAuth();
    const navigate = useNavigate();
    const socket = useRef<Socket>();

    useEffect(() => {
        (async () => {
            socket.current = io('ws://localhost:8089');

            socket.current?.emit('disconnectUser', state.user?.userProfileId);

            setTimeout(() => {
                logout();
    
                setTimeout(() => {
                    navigate(new URL('/login', document.baseURI).pathname);
                }, 2000);
            }, 1000);
        })();
    }, []);

    return (
        <div className={blockName}>
            <label className={`${blockName}-text`} id="progress-bar-label">
                Logging out...
            </label>
            <ProgressBar indeterminate={true} className="m-0 h-xs" aria-labelledby="progress-bar-label" />
        </div>
    )
}
