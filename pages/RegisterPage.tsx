
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../types';
import { mockSettings } from '../services/mockData';
import { UserPlus, ShieldCheck, User, Mail, Lock, ArrowRight, X, LockKeyhole } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.ANGGOTA);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const isRegistrationOpen = mockSettings.isRegistrationOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistrationOpen) return;
    
    setError('');
    if (!nama || !username || !gmail || !password) {
      setError('Semua field wajib diisi.');
      return;
    }
    const result = register({ nama, username, gmail, role, password });
    if (result.success) {
      navigate('/login', { state: { message: 'Registrasi berhasil! Silakan login untuk melanjutkan.' } });
    } else {
        setError(result.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-[520px] w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 p-10 md:p-12 animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl mb-6">
            <ShieldCheck className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Akun Baru</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm">Bergabung dengan sistem Inventaris UKM STIMBARA</p>
        </div>

        {!isRegistrationOpen ? (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 p-8 rounded-[2rem] text-center space-y-4">
                <LockKeyhole className="mx-auto text-rose-500" size={40} />
                <div>
                    <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400">Pendaftaran Ditutup</h3>
                    <p className="text-sm text-rose-600 dark:text-rose-500 mt-1">Maaf, admin sedang menutup akses pendaftaran anggota baru untuk sementara waktu.</p>
                </div>
                <Link to="/login" className="inline-block text-sm font-bold text-slate-500 hover:text-slate-800 underline">Kembali ke Login</Link>
            </div>
        ) : (
            <>
                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center">
                        <X className="mr-2" size={16}/> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
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
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium"
                            placeholder="Nama Lengkap Anda"
                            required
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                            <div className="relative">
                                <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium"
                                placeholder="username"
                                required
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            </div>

                            <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                            <div className="relative">
                                <input
                                type="email"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium"
                                placeholder="email@stimbara.ac.id"
                                required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            </div>
                        </div>

                        <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-medium"
                            placeholder="••••••••"
                            required
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <button
                        type="submit"
                        className="w-full flex items-center justify-center py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 transition-all group"
                        >
                        <UserPlus className="mr-2" size={18} />
                        Daftar Sekarang
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700">Login di sini</Link>
                </p>
            </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
