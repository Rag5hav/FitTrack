import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getCurrentUser } from '../../services/auth.service';
import { Menu, X } from 'lucide-react';

const Layout = () => {
    const user = getCurrentUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-darkBg overflow-hidden text-textMain relative">
            {/* Mobile Header */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-darkCard border-b border-slate-800 flex items-center justify-between px-4 z-40">
                <div className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
                    <span className="text-primary">Fit</span>Track
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="text-white p-2 focus:outline-none"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Wrapper */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <main className="flex-1 overflow-auto bg-darkBg pt-16 md:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
