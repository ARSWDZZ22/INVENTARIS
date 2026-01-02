
import React, { useState, useMemo } from 'react';
import { mockPeminjaman, mockBarang, mockUsers, updateBarangStock, syncAllData, addAuditLog } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { Peminjaman, LoanStatus, ItemStatus } from '../../types';
import { 
    CheckCircle2, XCircle, Download, Eye, 
    Calendar, Clock, Search, FileText, Info
} from 'lucide-react';

const LoanManagement: React.FC = () => {
    const { user: currentAdmin } = useAuth();
    const [loans, setLoans] = useState<Peminjaman[]>(mockPeminjaman);
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loansWithDetails = useMemo(() => {
        return loans.map(loan => ({
            ...loan,
            barang: mockBarang.find(b => b.id === loan.id_barang),
            user: mockUsers.find(u => u.id === loan.id_user),
        })).filter(l => 
            l.barang?.nama_alat.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.user?.nama.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            if (a.status === LoanStatus.MENUNGGU && b.status !== LoanStatus.MENUNGGU) return -1;
            if (a.status !== LoanStatus.MENUNGGU && b.status === LoanStatus.MENUNGGU) return 1;
            return new Date(b.tanggal_pinjam).getTime() - new Date(a.tanggal_pinjam).getTime();
        });
    }, [loans, searchTerm]);

    const handleLoanStatusChange = (loanId: number, barangId: number, newStatus: LoanStatus) => {
        const barang = mockBarang.find(b => b.id === barangId);
        
        if (newStatus === LoanStatus.DISETUJUI && barang && barang.stok <= 0) {
            alert('Gagal: Stok barang sudah habis!');
            return;
        }

        const updatedLoans = loans.map(loan => 
            loan.id === loanId ? { ...loan, status: newStatus } : loan
        );
        setLoans(updatedLoans);
        
        const idx = mockPeminjaman.findIndex(p => p.id === loanId);
        if(idx !== -1) {
          mockPeminjaman[idx].status = newStatus;
          const targetUser = mockUsers.find(u => u.id === mockPeminjaman[idx].id_user);
          addAuditLog(currentAdmin!.id, currentAdmin!.nama, `Update Status Pinjam`, `${newStatus} pengajuan dari ${targetUser?.nama}`, 'loan');
        }

        if (newStatus === LoanStatus.DISETUJUI) {
            updateBarangStock(barangId, -1);
        }
        
        syncAllData();
        setSelectedLoan(null);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Barang', 'Peminjam', 'NIM', 'Tgl Pinjam', 'Tgl Kembali', 'Keterangan', 'Status'];
        const rows = loansWithDetails.map(loan => [
            loan.id,
            loan.barang?.nama_alat || 'N/A',
            loan.user?.nama || 'N/A',
            loan.user?.nim || 'N/A',
            loan.tanggal_pinjam,
            loan.tanggal_kembali,
            `"${loan.keterangan || ''}"`,
            loan.status
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan-peminjaman.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 page-transition">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Peminjaman</h1>
                    <p className="text-slate-500 font-medium">Review dan validasi pengajuan pemakaian aset.</p>
                </div>
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg"
                >
                    <Download size={18} /> Ekspor Laporan
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari peminjam atau barang..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informasi Barang</th>
                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peminjam</th>
                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loansWithDetails.map(loan => (
                                <tr key={loan.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                                                <img src={loan.barang?.foto} className="w-full h-full object-cover" alt="item" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{loan.barang?.nama_alat}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deadline: {loan.tanggal_kembali}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <img src={loan.user?.profilePicture} className="w-8 h-8 rounded-full object-cover" alt="user" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{loan.user?.nama}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{loan.user?.nim}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg inline-flex items-center ${
                                            loan.status === LoanStatus.MENUNGGU ? 'bg-amber-50 text-amber-600' :
                                            loan.status === LoanStatus.DISETUJUI ? 'bg-emerald-50 text-emerald-600' :
                                            loan.status === LoanStatus.DITOLAK ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {loan.status === LoanStatus.MENUNGGU && <Clock size={12} className="mr-1.5" />}
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => setSelectedLoan(loan)}
                                                className="p-2.5 bg-slate-100 text-slate-500 hover:bg-slate-900 rounded-xl transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {loan.status === LoanStatus.MENUNGGU && (
                                                <>
                                                    <button 
                                                        onClick={() => handleLoanStatusChange(loan.id, loan.barang!.id, LoanStatus.DISETUJUI)}
                                                        className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleLoanStatusChange(loan.id, loan.barang!.id, LoanStatus.DITOLAK)}
                                                        className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedLoan && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-2xl animate-in overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Validasi Pengajuan</h2>
                            <button onClick={() => setSelectedLoan(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <XCircle className="text-slate-400" size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Informasi Barang</label>
                                    <div className="flex items-center gap-4">
                                        <img src={selectedLoan.barang?.foto} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt="item" />
                                        <div>
                                            <p className="font-bold text-slate-800">{selectedLoan.barang?.nama_alat}</p>
                                            <p className={`text-xs font-black uppercase tracking-wider text-emerald-600`}>
                                                Stok Tersedia: {selectedLoan.barang?.stok} Unit
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Peminjam</label>
                                    <div className="flex items-center gap-4">
                                        <img src={selectedLoan.user?.profilePicture} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" alt="user" />
                                        <div>
                                            <p className="font-bold text-slate-800">{selectedLoan.user?.nama}</p>
                                            <p className="text-xs text-slate-500 font-medium">{selectedLoan.user?.nim}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                                    <label className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-2">Jadwal Penggunaan</label>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-400">PINJAM</span>
                                            <span className="text-slate-700">{selectedLoan.tanggal_pinjam}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-400">ESTIMASI KEMBALI</span>
                                            <span className="text-slate-700">{selectedLoan.tanggal_kembali}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-2xl">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status Saat Ini</label>
                                    <p className="text-sm font-bold text-white">{selectedLoan.status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Logic Fix: Show Keterangan from Member */}
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8">
                             <div className="flex items-center gap-2 mb-3 text-primary-600">
                                <Info size={18} />
                                <h3 className="text-xs font-black uppercase tracking-widest">Alasan / Keterangan Peminjaman:</h3>
                             </div>
                             <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                "{selectedLoan.keterangan || 'Tidak ada keterangan tambahan.'}"
                             </p>
                        </div>

                        {selectedLoan.status === LoanStatus.MENUNGGU && (
                            <div className="mt-6 flex gap-4">
                                <button 
                                    onClick={() => handleLoanStatusChange(selectedLoan.id, selectedLoan.barang!.id, LoanStatus.DITOLAK)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Tolak
                                </button>
                                <button 
                                    onClick={() => handleLoanStatusChange(selectedLoan.id, selectedLoan.barang!.id, LoanStatus.DISETUJUI)}
                                    className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
                                    disabled={selectedLoan.barang?.stok <= 0}
                                >
                                    {selectedLoan.barang?.stok > 0 ? 'Setujui Pengajuan' : 'Stok Habis'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanManagement;
