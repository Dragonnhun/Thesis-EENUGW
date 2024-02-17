import 'themes/intertwine/views/logout.scss';
import { useAuth } from 'Frontend/util/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '@hilla/react-components/ProgressBar.js';

export default function LogoutView() {
    const blockName = 'logout';
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();

        setTimeout(() => {
            navigate(new URL('/login', document.baseURI).pathname);
        }, 1000);
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
