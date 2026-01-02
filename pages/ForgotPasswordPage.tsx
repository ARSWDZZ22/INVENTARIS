
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockUsers, syncAllData } from '../services/mockData';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertCircle, Timer, RotateCcw, KeyRound 
} from 'lucide-react';

type Step = 'identify' | 'otp' | 'reset';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State Management
  const [step, setStep] = useState<Step>('identify');
  const [gmail, setGmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI & Timer State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 menit
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> to avoid NodeJS namespace error in browser environment
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer Logic
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startOtpProcess = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeLeft(120);
    setStep('otp');
    setUserOtp('');
    
    // Simulasi pengiriman email dengan menampilkan OTP di Toast
    setTimeout(() => {
      showToast(`SIMULASI: Kode OTP Anda adalah ${code}`, 'warning');
    }, 500);
  };

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.gmail.toLowerCase() === gmail.toLowerCase());
      if (foundUser) {
        startOtpProcess();
      } else {
        setError('Alamat Gmail tersebut tidak ditemukan dalam sistem kami.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft === 0) {
      setError('Kode OTP telah kedaluwarsa. Silakan kirim ulang.');
      return;
    }
    if (userOtp === generatedOtp) {
      setStep('reset');
      showToast('Kode diverifikasi! Silakan buat sandi baru.', 'success');
      setError('');
    } else {
      setError('Kode OTP salah. Silakan periksa kembali.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi sandi tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Sandi baru minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(u => u.gmail.toLowerCase() === gmail.toLowerCase());
      if (userIndex !== -1) {
        mockUsers[userIndex].password = newPassword;
        syncAllData();
        showToast('Sandi berhasil diperbarui!', 'success');
        navigate('/login', { state: { message: 'Sandi berhasil diperbarui. Silakan login.' } });
      } else {
        setError('Terjadi kesalahan sistem.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-[480px] w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800 p-10 md:p-12 animate-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 p-4 rounded-2xl mb-6">
            <ShieldCheck className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {step === 'identify' && 'Lupa Sandi'}
            {step === 'otp' && 'Verifikasi OTP'}
            {step === 'reset' && 'Sandi Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm leading-relaxed">
            {step === 'identify' && 'Masukkan Gmail terdaftar untuk menerima kode verifikasi.'}
            {step === 'otp' && 'Masukkan 6 digit kode yang dikirim ke Gmail Anda.'}
            {step === 'reset' && 'Langkah terakhir, buat sandi baru untuk akun Anda.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center animate-in">
            <AlertCircle className="mr-2 shrink-0" size={16}/> {error}
          </div>
        )}

        {/* STEP 1: Identification */}
        {step === 'identify' && (
          <form onSubmit={handleIdentify} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat Gmail</label>
              <div className="relative">
                <input
                  type="email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                  placeholder="nama@stimbara.ac.id"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 transition-all group ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Mengecek Email...' : 'Kirim Kode OTP'}
              {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in">
            <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl border border-primary-100 dark:border-primary-800/50 mb-4 text-center">
              <p className="text-xs font-bold text-primary-700 dark:text-primary-400">Kode dikirim ke: {gmail}</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full tracking-[1em] text-center py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-2xl font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="••••••"
                  required
                />
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/30" size={20} />
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${timeLeft < 30 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                  <Timer size={14} />
                  <span>Kedaluwarsa dalam {formatTime(timeLeft)}</span>
                </div>
                
                {timeLeft === 0 && (
                  <button 
                    type="button" 
                    onClick={startOtpProcess}
                    className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <RotateCcw size={14} /> Kirim Ulang Kode
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={userOtp.length < 6 || timeLeft === 0}
              className={`w-full py-4 px-6 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl shadow-lg transition-all ${userOtp.length < 6 || timeLeft === 0 ? 'opacity-50' : 'hover:bg-black dark:hover:bg-slate-600'}`}
            >
              Verifikasi Kode
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-6 animate-in">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Sandi Baru</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Sandi Baru</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    placeholder="Ulangi sandi baru"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg transition-all ${loading ? 'opacity-50' : 'hover:bg-primary-700'}`}
            >
              {loading ? 'Menyimpan...' : 'Perbarui Sandi'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="mr-2" size={16} /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
