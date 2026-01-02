
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Role } from '../types';
import { LogIn, ShieldCheck, User, Lock, ArrowRight, X } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.ANGGOTA);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!identifier || !password) {
        setError('Email/Username dan password wajib diisi.');
        return;
    }
    const result = login(identifier, password, role);
    if (result.success) {
      if (role === Role.ADMIN) {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } else {
      setError(result.message || 'Login gagal. Periksa kembali data Anda.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-[480px] w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 p-10 md:p-12 animate-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl mb-6">
            <ShieldCheck className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">UISI Portal</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm">Masuk ke sistem Inventaris UKM STIMBARA</p>
        </div>

        {error && <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center"><X className="mr-2" size={16}/> {error}</div>}
        {successMessage && <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold mb-6"> {successMessage}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setRole(Role.ANGGOTA)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${role === Role.ANGGOTA ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Anggota
              </button>
              <button
                type="button"
                onClick={() => setRole(Role.ADMIN)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${role === Role.ADMIN ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Admin
              </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username / Email</label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium"
                  placeholder="admin atau anggota1"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-primary-600 hover:underline">Lupa Sandi?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 transition-all group"
          >
            Masuk Sekarang
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-semibold text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
