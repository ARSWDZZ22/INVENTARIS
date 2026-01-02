
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../services/mockData';
import { User, CheckCircle2, XCircle, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
    const { user: currentUser, updateUser } = useAuth();
    const [users, setUsers] = useState<User[]>(mockUsers);

    const handleStatusChange = (userId: number, newStatus: boolean) => {
        setUsers(currentUsers =>
            currentUsers.map(u => (u.id === userId ? { ...u, isActive: newStatus } : u))
        );
        updateUser({ id: userId, isActive: newStatus });
    };

    return (
        <div className="space-y-8 page-transition">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Pengguna</h1>
                <p className="text-slate-500 font-medium">Kontrol akses masuk dan kelola status aktifitas tim Anda.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                            <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Pengguna</th>
                            <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peran / Role</th>
                            <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi Toggle</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img src={user.profilePicture} alt={user.nama} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{user.nama}</p>
                                            <p className="text-xs text-slate-400 font-medium">{user.gmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' ? <Shield size={14} className="text-indigo-500" /> : null}
                                        <span className={`text-sm font-bold capitalize ${user.role === 'admin' ? 'text-indigo-600' : 'text-slate-600'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg ${
                                        user.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {user.isActive ? <CheckCircle2 size={12} className="mr-1.5"/> : <XCircle size={12} className="mr-1.5"/>}
                                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleStatusChange(user.id, !user.isActive)}
                                            disabled={user.id === currentUser?.id}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                                                user.isActive ? 'bg-primary-600' : 'bg-slate-200'
                                            } ${user.id === currentUser?.id ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                                    user.isActive ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
