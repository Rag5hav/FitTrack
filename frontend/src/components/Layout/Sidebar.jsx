import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Activity, Apple, TrendingUp, LogOut, User, MessageSquare } from 'lucide-react';
import { logout, getCurrentUser } from '../../services/auth.service';

const Sidebar = ({ onClose }) => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
        navigate('/login');
    };

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <Home size={20} /> },
        { path: '/workouts', name: 'Add Workout', icon: <Activity size={20} /> },
        { path: '/food', name: 'Add Meal', icon: <Apple size={20} /> },
        { path: '/progress', name: 'Progress', icon: <TrendingUp size={20} /> },
        { path: '/profile', name: 'Profile', icon: <User size={20} /> },
        { path: '/chat', name: 'AI Coach Chat', icon: <MessageSquare size={20} /> },
    ];

    return (
        <div className="w-64 bg-darkCard border-r border-slate-800 flex flex-col h-full shadow-2xl">
            <div className="p-6 flex items-center space-x-3 text-primary">
                <Activity size={28} />
                <h1 className="text-xl font-bold tracking-wider text-white">FitTrack</h1>
            </div>
            
            <div className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                                isActive 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'text-textMuted hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-6 border-t border-slate-800">
                <div className="flex items-center space-x-3 mb-6 bg-slate-800 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                        <p className="text-xs text-textMuted truncate w-32">{user?.email || 'email@example.com'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center space-x-2 text-rose-500 hover:bg-rose-500/10 px-4 py-3 rounded-xl transition-all font-medium"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
