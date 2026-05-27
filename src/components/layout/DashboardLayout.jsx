import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { clearUser, selectUser } from '../../redux/slices/authSlice';
import { clearChat } from '../../redux/slices/chatSlice';
import Sidebar from '../dashboard/sidebar/Sidebar';
import { cn } from '../../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function getInitials(name) {
  if (!name) return 'U';
  return name.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function UserAvatarDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method:      'POST',
        headers:     { Authorization: `Bearer ${localStorage.getItem('blinkus_token')}` },
        credentials: 'include',
      });
    } catch {}
    localStorage.removeItem('blinkus_token');
    dispatch(clearUser());
    dispatch(clearChat());
    navigate('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-black/5 transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
          {getInitials(user?.name)}
        </div>
        <ChevronDown
          size={14}
          className={cn('text-black/40 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-black/5 shadow-xl shadow-black/8 py-1.5 z-50"
        >
          <div className="px-4 py-2.5 border-b border-black/5 mb-1">
            <div className="text-sm font-bold truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-black/40 truncate">{user?.email}</div>
          </div>

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-black/60 hover:bg-black/3 hover:text-black transition-colors"
          >
            <User size={14} /> Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-black/60 hover:bg-black/3 hover:text-black transition-colors"
          >
            <Settings size={14} /> Settings
          </Link>

          <div className="my-1 mx-3 border-t border-black/5" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50/70 transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/*
        overflow-x-hidden (not overflow-hidden) so the absolutely-positioned
        dropdown in the header is not clipped by this container.
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="relative flex items-center justify-between px-4 h-14 bg-white border-b border-black/5 shrink-0 z-20">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />
          <UserAvatarDropdown />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable={false}
      />
    </div>
  );
}
