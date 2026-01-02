
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockPeminjaman, mockBarang, updateBarangStock, addAuditLog, syncAllData } from '../../services/mockData';
import { LoanStatus, Peminjaman } from '../../types';
import { RotateCcw, Clock, CheckCircle2, XCircle, Calendar, History } from 'lucide-react';
import ReturnItemModal from '../../components/ReturnItemModal';

const getStatusInfo = (status: LoanStatus) => {
    switch (status) {
        case LoanStatus.MENUNGGU: 
            return { text: 'Review', className: 'bg-amber-100 text-amber-700', icon: <Clock size={14} className="mr-1.5" /> };
        case LoanStatus.DISETUJUI: 
            return { text: 'Sedang Pinjam', className: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={14} className="mr-1.5" /> };
        case LoanStatus.DITOLAK: 
            return { text: 'Ditolak', className: 'bg-rose-100 text-rose-700', icon: <XCircle size={14} className="mr-1.5" /> };
        case LoanStatus.SELESAI: 
            return { text: 'Selesai', className: 'bg-slate-100 text-slate-600', icon: <CheckCircle2 size={14} className="mr-1.5" /> };
        default: return { text: 'Unknown', className: 'bg-gray-100 text-gray-800', icon: null };
    }
};

const MemberHistory: React.FC = () => {
    const { user } = useAuth();
    const [loans, setLoans] = useState([...mockPeminjaman]);
    const [selectedLoan, setSelectedLoan] = useState<Peminjaman | null>(null);

    const userLoans = useMemo(() => {
        if (!user) return [];
        return loans
            .filter(loan => loan.id_user === user.id)
            .map(loan => ({ ...loan, barang: mockBarang.find(b => b.id === loan.id_barang) }))
            .sort((a, b) => new Date(b.tanggal_pinjam).getTime() - new Date(a.tanggal_pinjam).getTime());
    }, [user, loans]);

    const handleReturnSubmit = (loanId: number, returnData: { kondisi_pengembalian: string, bukti_foto_kembali: string }) => {
        setLoans(prevLoans => prevLoans.map(loan => {
            if (loan.id === loanId) {
                updateBarangStock(loan.id_barang, 1);
                const globalIdx = mockPeminjaman.findIndex(p => p.id === loanId);
                if (globalIdx !== -1) {
                  mockPeminjaman[globalIdx] = {
                    ...mockPeminjaman[globalIdx],
                    status: LoanStatus.SELESAI,
                    tanggal_pengembalian_aktual: new Date().toISOString().split('T')[0],
                    ...returnData
                  };
                }
                addAuditLog(user!.id, user!.nama, 'Pengembalian', `Mengembalikan ${loan.barang?.nama_alat}`, 'return');
                syncAllData();
                return { ...loan, status: LoanStatus.SELESAI, ...returnData };
            }
            return loan;
        }));
        setSelectedLoan(null);
    };

    return (
        <div className="space-y-10 page-transition">
            <ReturnItemModal loan={selectedLoan} isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} onSubmit={handleReturnSubmit} />
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Riwayat Peminjaman</h1>
                <p className="text-slate-500 font-medium">Pantau status penggunaan aset UKM Anda.</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {userLoans.length > 0 ? (
                    userLoans.map(loan => {
                        const status = getStatusInfo(loan.status);
                        return (
                            <div key={loan.id} className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all">
                                <div className="w-full md:w-32 h-32 flex-shrink-0">
                                    <img src={loan.barang?.foto} alt={loan.barang?.nama_alat} className="w-full h-full object-cover rounded-[1.5rem] shadow-sm"/>
                                </div>
                                <div className="flex-1 w-full">
                                    <span className={`flex items-center w-fit px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg mb-2 ${status.className}`}>
                                        {status.icon} {status.text}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">{loan.barang?.nama_alat}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pinjam</span>
                                            <span className="text-sm font-semibold text-slate-700 mt-1">{loan.tanggal_pinjam}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wajib Kembali</span>
                                            <span className="text-sm font-semibold text-slate-700 mt-1">{loan.tanggal_kembali}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                    {loan.status === LoanStatus.DISETUJUI && (
                                        <button onClick={() => setSelectedLoan(loan)} className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center justify-center transition-all">
                                            <RotateCcw size={16} className="mr-2" /> Kembalikan
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
                        <History size={40} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">Belum Ada Riwayat</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberHistory;
