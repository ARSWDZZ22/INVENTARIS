
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Home, History, LogOut, Menu, X, UserCircle, HelpCircle, ShieldCheck, FilePenLine, Sun, Moon } from 'lucide-react';
import ContactUsModal from '../ContactUsModal';

const MemberLayout: React.FC = () => {
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
    { to: '/member/dashboard', icon: <Home size={20} />, text: 'Katalog Barang' },
    { to: '/member/loan', icon: <FilePenLine size={20} />, text: 'Form Pinjam' },
    { to: '/member/history', icon: <History size={20} />, text: 'Riwayat Saya' },
    { to: '/member/profile', icon: <UserCircle size={20} />, text: 'Profil Akun' },
  ];

  return (
    <>
      <ContactUsModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed md:relative z-40 bg-slate-900 dark:bg-slate-900/80 backdrop-blur-xl text-white w-72 h-full flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 ${isSidebarOpen ? 'left-0' : '-left-72 md:left-0'}`}>
          <div className="p-8 flex items-center gap-3">
             <div className="bg-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/20">
                <ShieldCheck className="text-slate-900" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-extrabold tracking-tight">UISI Portal</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">STIMBARA Member</p>
             </div>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
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
              <span>Pusat Bantuan</span>
            </button>
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all w-full text-left font-bold text-sm"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between md:justify-end items-center px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors no-print">
            <button className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20}/> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.nama}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Anggota Aktif</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-100 dark:border-primary-900 p-0.5">
                <img src={user?.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10 lg:p-12 transition-colors">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MemberLayout;
