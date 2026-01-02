    
import React, { useState, useMemo } from 'react';
import { mockBarang, mockPeminjaman, syncAllData } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Barang, ItemStatus, LoanStatus, Peminjaman } from '../../types';
import { 
    Tent, Backpack, CookingPot, Flashlight, Package, 
    X, Printer, Send, User, Phone, Search, 
    Calendar, ShoppingCart, Trash2, Info, Plus
} from 'lucide-react';

const LoanFormPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        nama: user?.nama || '',
        telepon: '',
        tanggalPinjam: new Date().toISOString().split('T')[0],
        tanggalKembali: '',
        keterangan: '',
    });
    
    const [borrowerType, setBorrowerType] = useState('pribadi');
    const [borrowerDetail, setBorrowerDetail] = useState('');
    const [borrowedItems, setBorrowedItems] = useState<Barang[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const categories = useMemo(() => {
        const cats = Array.from(new Set(mockBarang.map(b => b.jenis)));
        return ['all', ...cats];
    }, []);

    const filteredCatalog = useMemo(() => {
        return mockBarang.filter(item => 
            item.status === ItemStatus.TERSEDIA &&
            (categoryFilter === 'all' || item.jenis === categoryFilter) &&
            (item.nama_alat.toLowerCase().includes(searchTerm.toLowerCase()) || 
             item.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !borrowedItems.some(bi => bi.id === item.id)
        );
    }, [searchTerm, categoryFilter, borrowedItems]);

    const handleAddItem = (item: Barang) => {
        setBorrowedItems(prev => [...prev, item]);
        showToast(`Berhasil menambahkan ${item.nama_alat}`, 'success');
    };

    const handleRemoveItem = (itemId: number) => {
        setBorrowedItems(prev => prev.filter(item => item.id !== itemId));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (borrowedItems.length === 0) {
            showToast('Pilih minimal satu barang untuk dipinjam.', 'warning');
            return;
        }

        if (!formData.tanggalKembali) {
            showToast('Harap tentukan estimasi tanggal pengembalian.', 'warning');
            return;
        }

        // Validasi Logika Tanggal
        const tglPinjam = new Date(formData.tanggalPinjam);
        const tglKembali = new Date(formData.tanggalKembali);

        if (tglKembali < tglPinjam) {
            showToast('Tanggal kembali tidak boleh lebih awal dari tanggal pinjam.', 'error');
            return;
        }

        borrowedItems.forEach(item => {
            const newLoan: Peminjaman = {
                id: Date.now() + Math.random(),
                id_barang: item.id,
                id_user: user!.id,
                tanggal_pinjam: formData.tanggalPinjam,
                tanggal_kembali: formData.tanggalKembali,
                keterangan: `[${borrowerType.toUpperCase()}] ${borrowerDetail} - ${formData.keterangan}`,
                status: LoanStatus.MENUNGGU,
                bukti_foto_pinjam: 'https://picsum.photos/seed/loan/400/300',
            };
            mockPeminjaman.push(newLoan);
        });
        
        syncAllData();
        showToast('Pengajuan Anda telah dikirim ke Admin.', 'success');
        setBorrowedItems([]);
        setFormData(prev => ({ ...prev, keterangan: '', tanggalKembali: '' }));
        setBorrowerDetail('');
    };

    return (
        <div id="printable-area" className="max-w-7xl mx-auto space-y-8 page-transition pb-20">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Form Pengajuan Pinjam</h1>
                    <p className="text-slate-500 text-sm">Lengkapi data diri dan pilih inventaris yang Anda butuhkan.</p>
                </div>
                <div className="flex gap-2 no-print">
                    <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl flex items-center hover:bg-slate-50 transition-all">
                        <Printer size={16} className="mr-2" /> Cetak Form
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Form Alur Kerja */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center">
                                <User className="mr-2 text-primary-600" size={18}/> 1. Detail Pengajuan
                            </h2>
                            <div className="flex bg-slate-200 p-1 rounded-lg">
                                {['pribadi', 'logistik', 'umum'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setBorrowerType(type)}
                                        className={`px-4 py-1.5 text-[10px] font-black rounded-md uppercase tracking-wider transition-all ${borrowerType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Peminjam</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input type="tel" name="telepon" value={formData.telepon} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="08..." />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tgl Pinjam</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input type="date" name="tanggalPinjam" value={formData.tanggalPinjam} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Estimasi Kembali</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={16} />
                                        <input type="date" name="tanggalKembali" value={formData.tanggalKembali} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-primary-50/30 border border-primary-100 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500/20" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Keterangan / Instansi</label>
                                    <input type="text" value={borrowerDetail} onChange={e => setBorrowerDetail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none" placeholder="Contoh: NIM / UKM Musik" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center">
                                <Package className="mr-2 text-primary-600" size={18}/> 2. Pilih Inventaris
                            </h2>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Cari alat..." 
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-primary-500/20"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex flex-wrap gap-1.5 mb-6">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${categoryFilter === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        {cat === 'all' ? 'Semua' : cat}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                                {filteredCatalog.length > 0 ? (
                                    filteredCatalog.map(item => (
                                        <div key={item.id} className="p-2 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-primary-300 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                                                    <img 
                                                        src={item.foto} 
                                                        alt={item.nama_alat} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{item.nama_alat}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.brand} • <span className="text-primary-600">{item.kondisi}</span></p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleAddItem(item)} 
                                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                                title="Tambah ke keranjang"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <Package className="mx-auto text-slate-200 mb-2" size={32} />
                                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Barang Tidak Ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6 sticky top-8">
                    <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
                        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="text-primary-500" size={20} />
                                <h2 className="text-white font-bold text-sm tracking-tight">Ringkasan Pinjam</h2>
                            </div>
                            <span className="bg-primary-600 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">{borrowedItems.length} Alat</span>
                        </div>

                        <div className="p-6">
                            {borrowedItems.length > 0 ? (
                                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                    {borrowedItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                                    <img src={item.foto} alt={item.nama_alat} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="text-[11px] font-bold text-white block truncate">{item.nama_alat}</span>
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.brand}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                                    <ShoppingCart className="mx-auto mb-2 text-slate-700" size={32} />
                                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Keranjang Masih Kosong</p>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-white/5 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-1">Catatan Tambahan</label>
                                    <textarea name="keterangan" value={formData.keterangan} onChange={handleInputChange} rows={2} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-primary-500/50" placeholder="Keterangan tambahan (opsional)..."></textarea>
                                </div>
                                
                                <div className="flex justify-between items-end px-1">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Barang</span>
                                        <span className="text-sm font-bold text-white">{borrowedItems.length} Unit</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status Pengajuan</span>
                                        <span className="text-xs font-bold text-amber-500 block italic">Menunggu Review</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSubmit}
                                    disabled={borrowedItems.length === 0}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${borrowedItems.length > 0 ? 'bg-primary-600 hover:bg-primary-500 text-slate-900 shadow-primary-500/20' : 'bg-white/5 text-slate-600 cursor-not-allowed shadow-none'}`}
                                >
                                    <Send size={16} /> 
                                    <span className="text-sm">Kirim Pengajuan</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanFormPage;
