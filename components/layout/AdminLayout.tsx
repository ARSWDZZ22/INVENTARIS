
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, UserCircle, Users, HelpCircle, ShieldCheck, Settings, Sun, Moon } from 'lucide-react';
import ContactUsModal from '../ContactUsModal';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/admin/inventory', icon: <Package size={20} />, text: 'Inventaris' },
    { to: '/admin/loans', icon: <ShoppingBag size={20} />, text: 'Peminjaman' },
    { to: '/admin/users', icon: <Users size={20} />, text: 'Tim & Anggota' },
    { to: '/admin/settings', icon: <Settings size={20} />, text: 'Pengaturan' },
    { to: '/admin/profile', icon: <UserCircle size={20} />, text: 'Profil Saya' },
  ];

  return (
    <>
      <ContactUsModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        <aside className={`fixed md:relative z-40 bg-slate-900 dark:bg-slate-900/50 backdrop-blur-xl text-white w-72 h-full flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 ${isSidebarOpen ? 'left-0' : '-left-72 md:left-0'}`}>
          <div className="p-8 flex items-center gap-3">
             <div className="bg-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/20">
                <ShieldCheck className="text-slate-900" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-extrabold tracking-tight">Admin UISI</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">STIMBARA Portal</p>
             </div>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-4 rounded-2xl font-bold transition-all duration-300 ${
                    isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.icon}
                <span className="text-sm">{link.text}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 bg-black/20">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-400 hover:text-white transition-all w-full text-left font-semibold text-sm mb-1"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
            </button>
            <button
              onClick={() => setContactModalOpen(true)}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-400 hover:text-white transition-all w-full text-left font-semibold text-sm mb-1"
            >
              <HelpCircle size={18} />
              <span>Bantuan</span>
            </button>
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all w-full text-left font-bold text-sm"
              >
                <LogOut size={18} />
                <span>Logout Keluar</span>
              </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors md:hidden">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">UISI Portal</h1>
            <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20}/> : <Menu size={20} />}
            </button>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10 lg:p-12 transition-colors">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
