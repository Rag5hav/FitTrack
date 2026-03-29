import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getCurrentUser } from '../../services/auth.service';

const Layout = () => {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-darkBg overflow-hidden text-textMain">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-darkBg">
                <div className="p-8 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
