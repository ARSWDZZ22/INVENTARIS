
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Role } from '../types';
import { 
    Edit, Save, Camera, X, User as UserIcon, 
    Mail, IdCard, ShieldCheck, CheckCircle2, 
    Smartphone, MapPin, Globe
} from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                nama: user.nama,
                username: user.username,
                gmail: user.gmail,
                nim: user.nim,
            });
            setProfilePicPreview(user.profilePicture || null);
        }
    }, [user, isEditing]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateUser({ ...formData, id: user.id, profilePicture: profilePicPreview || user.profilePicture });
        setIsEditing(false);
        // Toast atau notifikasi bisa ditambahkan di sini
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfilePicPreview(user.profilePicture || null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 page-transition pb-20">
            {/* Profile Header Card */}
            <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
                {/* Cover Area */}
                <div className="h-48 bg-gradient-to-r from-slate-900 via-brand-dark to-slate-800 relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
                
                <div className="px-10 pb-10 relative">
                    <div className="flex flex-col md:flex-row items-end -mt-16 gap-6">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden bg-white">
                                <img 
                                    src={profilePicPreview || 'https://i.pravatar.cc/150'} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            {isEditing && (
                                <label htmlFor="profile-pic-upload" className="absolute bottom-2 right-2 bg-primary-600 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-primary-700 shadow-lg transition-all scale-100 hover:scale-110">
                                    <Camera size={20} />
                                    <input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        {/* Name & Role Section */}
                        <div className="flex-1 pb-2">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.nama}</h1>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center ${
                                    user.role === Role.ADMIN ? 'bg-indigo-50 text-indigo-600' : 'bg-primary-50 text-primary-600'
                                }`}>
                                    {user.role === Role.ADMIN ? <ShieldCheck size={12} className="mr-1.5" /> : <UserIcon size={12} className="mr-1.5" />}
                                    {user.role}
                                </span>
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center">
                                    <CheckCircle2 size={12} className="mr-1.5" /> Aktif
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium">@{user.username} • STIMBARA UISI Portal</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pb-2">
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-slate-900/10"
                                >
                                    <Edit size={18} /> Edit Profil
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCancel} 
                                        className="flex items-center gap-2 bg-slate-100 text-slate-500 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                                    >
                                        <X size={18} /> Batal
                                    </button>
                                    <button 
                                        onClick={handleSave} 
                                        className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                                    >
                                        <Save size={18} /> Simpan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                            <UserIcon size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Informasi Pribadi</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <ProfileInput 
                            label="Nama Lengkap" 
                            name="nama" 
                            icon={<UserIcon size={18} />} 
                            value={formData.nama || ''} 
                            isEditing={isEditing} 
                            onChange={handleInputChange} 
                        />
                        <ProfileInput 
                            label="Username" 
                            name="username" 
                            icon={<Globe size={18} />} 
                            value={formData.username || ''} 
                            isEditing={isEditing} 
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>

                {/* Campus Identity */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                            <IdCard size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Identitas Kampus</h2>
                    </div>

                    <div className="space-y-5">
                        <ProfileInput 
                            label="Nomor Induk Mahasiswa (NIM)" 
                            name="nim" 
                            icon={<IdCard size={18} />} 
                            value={formData.nim || ''} 
                            isEditing={isEditing} 
                            onChange={handleInputChange} 
                        />
                        <ProfileInput 
                            label="Email Institusi" 
                            name="gmail" 
                            icon={<Mail size={18} />} 
                            value={formData.gmail || ''} 
                            isEditing={isEditing} 
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Keamanan Akun</p>
                        <p className="text-xs text-slate-500 font-medium">Akun Anda diverifikasi dan dilindungi oleh sistem UISI.</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Terakhir Login</p>
                    <p className="text-xs font-bold text-slate-700">Hari ini, 10:45 WIB</p>
                </div>
            </div>
        </div>
    );
};

interface ProfileInputProps {
    label: string;
    name: string;
    value: string;
    isEditing: boolean;
    icon: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ label, name, value, isEditing, icon, onChange }) => {
    return (
        <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className={`relative flex items-center transition-all duration-300 ${isEditing ? 'translate-x-0' : 'translate-x-0'}`}>
                <div className={`absolute left-4 transition-colors ${isEditing ? 'text-primary-500' : 'text-slate-300'}`}>
                    {icon}
                </div>
                {isEditing ? (
                    <input
                        type={name === 'gmail' ? 'email' : 'text'}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all shadow-sm"
                        placeholder={`Masukkan ${label}...`}
                    />
                ) : (
                    <div className="w-full pl-12 pr-4 py-3.5 bg-white border border-transparent rounded-2xl text-slate-700 font-bold">
                        {value || '-'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
