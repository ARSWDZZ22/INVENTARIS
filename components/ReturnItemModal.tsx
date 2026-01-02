
import React, { useState, useEffect } from 'react';
import { Peminjaman } from '../types';
import { X, Camera, Upload, Calendar, CheckCircle2 } from 'lucide-react';

interface ReturnItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Peminjaman | null;
    onSubmit: (loanId: number, returnData: { kondisi_pengembalian: string, bukti_foto_kembali: string }) => void;
}

const ReturnItemModal: React.FC<ReturnItemModalProps> = ({ isOpen, onClose, loan, onSubmit }) => {
    const [kondisi, setKondisi] = useState('Baik');
    const [foto, setFoto] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setKondisi('Baik');
            setFoto(null);
            setImagePreview(null);
        }
    }, [isOpen]);

    if (!isOpen || !loan) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFoto(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!foto) {
            alert('Silakan unggah foto bukti pengembalian barang sebagai syarat sah.');
            return;
        }
        onSubmit(loan.id, {
            kondisi_pengembalian: kondisi,
            bukti_foto_kembali: foto
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-lg animate-in overflow-y-auto max-h-[95vh] custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Form Pengembalian</h2>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-1">Sistem Validasi Inventaris</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><X size={20} /></button>
                </div>
                
                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                    <img src={loan.barang?.foto} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-white" />
                    <div>
                        <p className="font-bold text-slate-800 text-lg leading-tight">{loan.barang?.nama_alat}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">Tgl Pinjam: {loan.tanggal_pinjam}</p>
                    </div>
                </div>

                <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <div>
                        <p className="text-sm font-bold text-emerald-800">Verifikasi Fisik</p>
                        <p className="text-[10px] font-medium text-emerald-600">Unggah bukti foto kondisi barang saat ini untuk menyelesaikan sesi pinjam.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                          <Calendar size={12} className="mr-1.5"/> Kondisi Barang Akhir
                        </label>
                        <select
                            value={kondisi}
                            onChange={(e) => setKondisi(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none"
                        >
                            <option>Baik</option>
                            <option>Rusak</option>
                            <option>Perlu Pembersihan</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                          <Camera size={12} className="mr-1.5"/> Foto Bukti Pengembalian
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-28 h-28 object-cover rounded-2xl shadow-md" />
                            ) : (
                                <div className="w-28 h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                                    <Camera size={28} />
                                </div>
                            )}
                            <label htmlFor="return-file-upload" className="cursor-pointer bg-white py-3 px-5 border border-slate-200 rounded-xl shadow-sm text-xs font-black uppercase tracking-widest text-slate-600">
                                <Upload size={14} className="inline mr-2"/> Unggah
                                <input id="return-file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                    
                    <div className="pt-6 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                        <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:bg-black transition-all">Selesaikan Sesi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReturnItemModal;
