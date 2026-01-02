
import React, { useState } from 'react';
import { mockSettings, updateSystemSettings } from '../../services/mockData';
import { useToast } from '../../context/ToastContext';
// Added 'X' to imports
import { 
    Settings, Save, Mail, Phone, User, Building, 
    ShieldCheck, HelpCircle, LayoutGrid, ToggleLeft, 
    CalendarRange, Trash2, Plus, Info, X
} from 'lucide-react';

type TabType = 'profile' | 'policy' | 'categories' | 'access';

const SettingsPage: React.FC = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [formData, setFormData] = useState({ ...mockSettings });
    const [newCategory, setNewCategory] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) 
        }));
    };

    const handleSave = () => {
        updateSystemSettings(formData);
        showToast('Konfigurasi sistem berhasil diperbarui!', 'success');
    };

    const addCategory = () => {
        if (!newCategory.trim()) return;
        if (formData.categories.includes(newCategory.trim())) {
            showToast('Kategori sudah ada!', 'warning');
            return;
        }
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, newCategory.trim()]
        }));
        setNewCategory('');
    };

    const removeCategory = (cat: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== cat)
        }));
    };

    const tabs = [
        { id: 'profile', text: 'Profil Organisasi', icon: <Building size={16} /> },
        { id: 'policy', text: 'Aturan Pinjam', icon: <CalendarRange size={16} /> },
        { id: 'categories', text: 'Master Kategori', icon: <LayoutGrid size={16} /> },
        { id: 'access', text: 'Keamanan Akses', icon: <ShieldCheck size={16} /> },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 page-transition pb-20">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pengaturan Sistem</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Pusat kendali parameter global aplikasi.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tab Selection */}
                <div className="lg:w-72 flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                                activeTab === tab.id 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                            }`}
                        >
                            {tab.icon}
                            {tab.text}
                        </button>
                    ))}
                    
                    <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white hidden lg:block">
                        <Info size={24} className="text-primary-500 mb-3" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Pemberitahuan</h3>
                        <p className="text-[11px] leading-relaxed opacity-70 italic">Perubahan di menu ini akan langsung mempengaruhi alur kerja seluruh anggota.</p>
                    </div>
                </div>

                {/* Main Settings Content */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">Kontak Organisasi</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <SettingInput label="Nama Organisasi / UKM" name="organizationName" value={formData.organizationName} icon={<Building size={18}/>} onChange={handleInputChange} />
                                    <SettingInput label="Admin Penanggung Jawab" name="adminContactName" value={formData.adminContactName} icon={<User size={18}/>} onChange={handleInputChange} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <SettingInput label="Email Bantuan" name="adminContactEmail" value={formData.adminContactEmail} icon={<Mail size={18}/>} onChange={handleInputChange} type="email" />
                                        <SettingInput label="No. WhatsApp" name="adminContactPhone" value={formData.adminContactPhone} icon={<Phone size={18}/>} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* POLICY TAB */}
                        {activeTab === 'policy' && (
                            <div className="space-y-8 animate-in">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">Kebijakan Peminjaman</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <SettingInput 
                                        label="Maksimal Barang per Anggota" 
                                        name="maxItemsPerUser" 
                                        value={formData.maxItemsPerUser.toString()} 
                                        icon={<LayoutGrid size={18}/>} 
                                        onChange={handleInputChange} 
                                        type="number" 
                                        helper="Batas item yang dapat dipinjam bersamaan."
                                    />
                                    <SettingInput 
                                        label="Durasi Maksimal (Hari)" 
                                        name="maxLoanDurationDays" 
                                        value={formData.maxLoanDurationDays.toString()} 
                                        icon={<CalendarRange size={18}/>} 
                                        onChange={handleInputChange} 
                                        type="number" 
                                        helper="Batas waktu peminjaman default."
                                    />
                                </div>
                            </div>
                        )}

                        {/* CATEGORIES TAB */}
                        {activeTab === 'categories' && (
                            <div className="space-y-8 animate-in">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">Manajemen Kategori Alat</h2>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Tambah kategori baru..." 
                                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none font-bold"
                                        value={newCategory}
                                        onChange={e => setNewCategory(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && addCategory()}
                                    />
                                    <button onClick={addCategory} className="px-5 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-black transition-all">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {formData.categories.map(cat => (
                                        <div key={cat} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cat}</span>
                                            {/* Fix: X icon now available through import */}
                                            <button onClick={() => removeCategory(cat)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ACCESS TAB */}
                        {activeTab === 'access' && (
                            <div className="space-y-8 animate-in">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">Keamanan & Pendaftaran</h2>
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">Pendaftaran Anggota Baru</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aktifkan agar mahasiswa baru dapat mendaftar sendiri.</p>
                                    </div>
                                    <button 
                                        onClick={() => setFormData(prev => ({...prev, isRegistrationOpen: !prev.isRegistrationOpen}))}
                                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
                                            formData.isRegistrationOpen ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                                        }`}
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.isRegistrationOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-10">
                            <button 
                                onClick={handleSave}
                                className="w-full py-4 bg-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> Simpan Semua Konfigurasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingInput: React.FC<{ label: string; name: string; value: string; icon: React.ReactNode; onChange: any; type?: string; helper?: string }> = ({ label, name, value, icon, onChange, type = 'text', helper }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600">{icon}</div>
            <input 
                type={type} 
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-bold focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none" 
            />
        </div>
        {helper && <p className="text-[10px] text-slate-400 dark:text-slate-500 italic ml-1">* {helper}</p>}
    </div>
);

export default SettingsPage;
