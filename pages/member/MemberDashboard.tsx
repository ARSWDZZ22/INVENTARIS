
import React, { useState, useMemo, useEffect } from 'react';
import { mockBarang, mockPeminjaman } from '../../services/mockData';
import { Barang, ItemStatus, Peminjaman, LoanStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Search, X, ChevronLeft, ChevronRight, Filter, Info, PackageOpen } from 'lucide-react';

const BorrowItemModal: React.FC<{
    item: Barang | null;
    isOpen: boolean;
    onClose: () => void;
    onBorrow: (loanData: Omit<Peminjaman, 'id' | 'id_user' | 'status'>) => void;
}> = ({ item, isOpen, onClose, onBorrow }) => {
    const [keterangan, setKeterangan] = useState('');
    const [tanggalKembali, setTanggalKembali] = useState('');
    
    if (!isOpen || !item) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onBorrow({
            id_barang: item.id,
            tanggal_pinjam: new Date().toISOString().split('T')[0],
            tanggal_kembali: tanggalKembali,
            keterangan: keterangan,
            bukti_foto_pinjam: 'https://picsum.photos/seed/buktiPinjam/400/300'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Detail Peminjaman</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="flex gap-4 mb-8 p-4 bg-slate-50 rounded-2xl">
                    <img src={item.foto} alt={item.nama_alat} className="w-24 h-24 object-cover rounded-xl shadow-sm"/>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">{item.nama_alat}</h3>
                        <p className="text-sm font-semibold text-primary-600 mb-2">{item.brand}</p>
                        <div className="flex items-center text-xs text-slate-400 font-medium">
                            <Info size={14} className="mr-1" /> Kondisi: {item.kondisi}
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Estimasi Pengembalian</label>
                        <input type="date" value={tanggalKembali} onChange={e => setTanggalKembali(e.target.value)} className="w-full p-3 border-slate-200 border bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Alasan/Keperluan</label>
                        <textarea placeholder="Ceritakan tujuan peminjaman Anda..." value={keterangan} onChange={e => setKeterangan(e.target.value)} className="w-full p-3 border-slate-200 border bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all" rows={3}></textarea>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors">Batal</button>
                        <button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all">Ajukan Pinjam</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ItemCard: React.FC<{ item: Barang, onBorrowClick: (item: Barang) => void }> = ({ item, onBorrowClick }) => {
    const isAvailable = item.status === ItemStatus.TERSEDIA;
    
    let statusConfig = { bg: 'bg-slate-100', text: 'text-slate-600' };
    if(item.status === ItemStatus.TERSEDIA) statusConfig = { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if(item.status === ItemStatus.DIPINJAM) statusConfig = { bg: 'bg-amber-100', text: 'text-amber-700' };
    if(item.status === ItemStatus.RUSAK) statusConfig = { bg: 'bg-rose-100', text: 'text-rose-700' };

    return (
        <div className="group bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100 flex flex-col">
            <div className="relative overflow-hidden aspect-[4/3]">
                <img src={item.foto} alt={item.nama_alat} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm ${statusConfig.bg} ${statusConfig.text}`}>
                        {item.status}
                    </span>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.jenis}</p>
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-4 group-hover:text-primary-600 transition-colors">{item.nama_alat}</h3>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Brand</span>
                        <span className="text-sm font-bold text-slate-700">{item.brand}</span>
                    </div>
                    <button 
                        disabled={!isAvailable} 
                        onClick={() => onBorrowClick(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isAvailable 
                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/10' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}>
                        {isAvailable ? 'Pinjam Sekarang' : 'Tidak Tersedia'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ITEMS_PER_PAGE = 8;

const MemberDashboard: React.FC = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>(ItemStatus.TERSEDIA);
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<Barang | null>(null);
    
    const itemTypes = useMemo(() => {
        const types = new Set(mockBarang.map(item => item.jenis));
        return ['all', ...Array.from(types)];
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, typeFilter]);

    const filteredItems = useMemo(() => {
        return mockBarang.filter(item =>
            (item.nama_alat.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'all' || item.status === statusFilter) &&
            (typeFilter === 'all' || item.jenis === typeFilter)
        );
    }, [searchTerm, statusFilter, typeFilter]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    const handleBorrow = (loanData: Omit<Peminjaman, 'id' | 'id_user' | 'status'>) => {
        if (!user) return;
        const newLoan: Peminjaman = {
            id: mockPeminjaman.length + 1,
            id_user: user.id,
            status: LoanStatus.MENUNGGU,
            ...loanData,
        };
        mockPeminjaman.push(newLoan);
        alert('Pengajuan peminjaman berhasil dikirim!');
    };

    return (
        <div className="space-y-10 page-transition pb-20">
            <BorrowItemModal 
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                onBorrow={handleBorrow}
            />

            <div className="relative overflow-hidden bg-brand-dark rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Temukan Alat Petualanganmu.</h1>
                    <p className="text-emerald-100/70 text-lg font-medium mb-8 leading-relaxed">Pilih dari puluhan peralatan berkualitas untuk menunjang kegiatan UKM STIMBARA-mu.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Cari tenda, carrier, atau lainnya..."
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-emerald-100/50 outline-none focus:bg-white/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-100/50" size={20} />
                        </div>
                        <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-brand-dark font-bold rounded-2xl shadow-xl transition-all">Cari Aset</button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                     <PackageOpen size={400} className="-mr-20 -mt-20" />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap gap-2">
                    {['all', ItemStatus.TERSEDIA, ItemStatus.DIPINJAM].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                statusFilter === status 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' 
                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                            }`}
                        >
                            {status === 'all' ? 'Semua' : status}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <Filter size={16} className="text-slate-400" />
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent text-sm font-bold text-slate-600 outline-none">
                        {itemTypes.map(type => (
                            <option key={type} value={type}>{type === 'all' ? 'Semua Kategori' : type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {paginatedItems.map(item => (
                    <ItemCard key={item.id} item={item} onBorrowClick={setSelectedItem} />
                ))}
            </div>

             {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Pencarian Tidak Ditemukan</h3>
                    <p className="text-slate-500">Coba gunakan kata kunci lain atau bersihkan filter.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Hal {currentPage} dari {totalPages}
                    </span>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-xl disabled:opacity-30 bg-slate-100 hover:bg-slate-200 transition-colors">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 rounded-xl disabled:opacity-30 bg-slate-100 hover:bg-slate-200 transition-colors">
                            <ChevronRight size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDashboard;
