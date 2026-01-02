
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { mockBarang, mockPeminjaman, mockAuditLogs } from '../../services/mockData';
import { ItemStatus, LoanStatus } from '../../types';
import { 
    Package, Truck, AlertCircle, Clock, ArrowUpRight, 
    FileText, Download, CheckCircle2, History, User, ExternalLink, RotateCcw
} from 'lucide-react';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; trend: string; isPositive: boolean }> = ({ title, value, icon, color, trend, isPositive }) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex flex-col hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                {icon}
            </div>
            <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'} bg-slate-50 px-2 py-1 rounded-full`}>
                <ArrowUpRight size={14} className="mr-1" /> {trend}
            </div>
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'laporan'>('overview');

    const stats = useMemo(() => {
        const total = mockBarang.length;
        const tersedia = mockBarang.filter(b => b.status === ItemStatus.TERSEDIA).length;
        const dipinjam = mockBarang.filter(b => b.status === ItemStatus.DIPINJAM).length;
        const rusak = mockBarang.filter(b => b.status === ItemStatus.RUSAK).length;
        const pendingLoans = mockPeminjaman.filter(p => p.status === LoanStatus.MENUNGGU).length;
        return { total, tersedia, dipinjam, rusak, pendingLoans };
    }, []);

    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
        return months.map(m => ({ name: m, Peminjaman: Math.floor(Math.random() * 20) + 5 }));
    }, []);

    const pieData = [
        { name: 'Tersedia', value: stats.tersedia, color: '#10b981' },
        { name: 'Dipinjam', value: stats.dipinjam, color: '#f59e0b' },
        { name: 'Rusak', value: stats.rusak, color: '#ef4444' },
    ];

    return (
        <div className="space-y-8 page-transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium">Pantau aktivitas inventaris UKM secara real-time.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('laporan')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'laporan' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Laporan
                    </button>
                </div>
            </div>
            
            {activeTab === 'overview' ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Jenis Aset" value={stats.total} icon={<Package size={22}/>} color="bg-emerald-500" trend="+12%" isPositive={true} />
                        <StatCard title="Review Masuk" value={stats.pendingLoans} icon={<Clock size={22}/>} color="bg-amber-500" trend="0%" isPositive={true} />
                        <StatCard title="Butuh Service" value={stats.rusak} icon={<AlertCircle size={22}/>} color="bg-rose-500" trend="-2%" isPositive={false} />
                        <StatCard title="Aset Keluar" value={stats.dipinjam} icon={<Truck size={22}/>} color="bg-indigo-500" trend="+5%" isPositive={true} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Chart Card */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Grafik Aktivitas</h2>
                                    <select className="text-sm bg-slate-50 border-none font-semibold rounded-lg px-3 py-1 text-slate-600 outline-none">
                                        <option>6 Bulan Terakhir</option>
                                    </select>
                                </div>
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorLoan" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Area type="monotone" dataKey="Peminjaman" stroke="#16a34a" strokeWidth={3} fill="url(#colorLoan)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Dynamic Audit Log */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <History className="text-slate-400" size={20} />
                                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Aktivitas Audit Terbaru</h2>
                                    </div>
                                    <button className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center">
                                        Seluruh Log <ExternalLink size={12} className="ml-1" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {mockAuditLogs.slice(0, 5).map(log => (
                                        <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                                                    {log.type === 'loan' ? <Truck size={18} /> : 
                                                     log.type === 'return' ? <RotateCcw size={18} /> : 
                                                     log.type === 'inventory' ? <Package size={18} /> : <User size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {log.userName} <span className="font-medium text-slate-400">melakukan</span> {log.action}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{log.details} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg ${
                                                log.type === 'loan' ? 'bg-amber-100 text-amber-600' :
                                                log.type === 'return' ? 'bg-emerald-100 text-emerald-600' : 
                                                log.type === 'inventory' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {log.type}
                                            </span>
                                        </div>
                                    ))}
                                    {mockAuditLogs.length === 0 && (
                                      <div className="py-8 text-center text-slate-400 text-xs font-bold">Belum ada log tercatat.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 flex flex-col h-fit">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-8">Status Distribusi Aset</h2>
                            <div className="h-[220px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-extrabold text-slate-800">{stats.total}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</span>
                                </div>
                            </div>
                            <div className="mt-8 space-y-4">
                                {pieData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                                        <div className="flex items-center">
                                            <div className="w-2.5 h-2.5 rounded-full mr-3" style={{backgroundColor: item.color}}></div>
                                            <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100 animate-in">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Ringkasan Laporan UKM</h2>
                            <p className="text-slate-500 mt-1">Laporan komprehensif inventaris STIMBARA periode ini.</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all">
                            <Download size={18} /> Ekspor PDF
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <FileText className="text-primary-600 mb-4" size={24} />
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</h3>
                            <p className="text-3xl font-extrabold text-slate-800">{mockPeminjaman.length}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <CheckCircle2 className="text-emerald-600 mb-4" size={24} />
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Selesai Tepat Waktu</h3>
                            <p className="text-3xl font-extrabold text-slate-800">85%</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <AlertCircle className="text-amber-600 mb-4" size={24} />
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Butuh Perbaikan</h3>
                            <p className="text-3xl font-extrabold text-slate-800">{stats.rusak}</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="Peminjaman" fill="#16a34a" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
