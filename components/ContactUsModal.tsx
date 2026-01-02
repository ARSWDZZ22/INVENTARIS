
import React from 'react';
import { X, User as UserIcon, Mail, Phone, Info } from 'lucide-react';
import { mockSettings } from '../services/mockData';

interface ContactUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md animate-in relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Bantuan</h2>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-1">Layanan Mahasiswa</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8 relative z-10">
                    <div className="flex items-start gap-3 text-slate-500">
                        <Info size={18} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed italic">
                            Silakan hubungi admin melalui kontak resmi di bawah ini jika Anda menemui kendala sistem atau ingin berkonsultasi mengenai peminjaman.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6 relative z-10 px-2">
                    <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                            <UserIcon size={12} className="mr-1.5" /> Penanggung Jawab
                        </p>
                        <p className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{mockSettings.adminContactName}</p>
                    </div>

                    <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                            <Mail size={12} className="mr-1.5" /> Email Resmi
                        </p>
                        <p className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{mockSettings.adminContactEmail}</p>
                    </div>

                    <div className="group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                            <Phone size={12} className="mr-1.5" /> No. WhatsApp
                        </p>
                        <p className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{mockSettings.adminContactPhone}</p>
                    </div>
                </div>

                <div className="mt-10 pt-4 flex relative z-10">
                    <button 
                        onClick={onClose} 
                        className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-black transition-all"
                    >
                        Tutup Informasi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactUsModal;
