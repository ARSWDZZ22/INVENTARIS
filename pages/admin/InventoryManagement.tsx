
import React, { useState, useMemo, useEffect } from 'react';
import { mockBarang, syncAllData, addAuditLog } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { Barang, ItemStatus } from '../../types';
import { Plus, Edit, Trash2, Search, Camera, ChevronLeft, ChevronRight, Box, XCircle, Tag } from 'lucide-react';

const ItemModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<Barang, 'id' | 'created_at'>) => void;
    itemToEdit?: Barang | null;
}> = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const [formData, setFormData] = useState<Omit<Barang, 'id' | 'created_at'>>({
        nama_alat: '',
        jenis: '',
        brand: '',
        seri: '',
        kondisi: 'Baik',
        status: ItemStatus.TERSEDIA,
        stok: 1,
        catatan: '',
        foto: '', 
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                nama_alat: itemToEdit.nama_alat,
                jenis: itemToEdit.jenis,
                brand: itemToEdit.brand,
                seri: itemToEdit.seri,
                kondisi: itemToEdit.kondisi,
                status: itemToEdit.status,
                stok: itemToEdit.stok,
                catatan: itemToEdit.catatan,
                foto: itemToEdit.foto,
            });
            setImagePreview(itemToEdit.foto);
        } else {
            setFormData({
                nama_alat: '',
                jenis: '',
                brand: '',
                seri: '',
                kondisi: 'Baik',
                status: ItemStatus.TERSEDIA,
                stok: 1,
                catatan: '',
                foto: '',
            });
            setImagePreview(null);
        }
    }, [itemToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'stok' ? Number(value) : value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, foto: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">{itemToEdit ? 'Edit Data Barang' : 'Tambah Inventaris Baru'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <XCircle className="text-slate-400" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-[2rem] shadow-md border-4 border-white" />
                            ) : (
                                <div className="w-32 h-32 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group-hover:bg-slate-100 transition-all">
                                    <Camera size={32} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Foto</span>
                                </div>
                            )}
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Alat</label>
                            <input type="text" name="nama_alat" value={formData.nama_alat} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Jenis / Kategori</label>
                            <input type="text" name="jenis" value={formData.jenis} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Brand / Merk</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" required />
                        </div>
                        
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 md:col-span-2">
                             <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                                    <Tag size={12} className="mr-1.5" /> Kuantitas Stok
                                </label>
                                <input type="number" name="stok" value={formData.stok} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl font-bold text-slate-800" min="0" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Kondisi</label>
                            <select name="kondisi" value={formData.kondisi} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium">
                                <option>Baik</option>
                                <option>Rusak</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Status Sistem</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium">
                                {Object.values(ItemStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                        <button type="submit" className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">Simpan Data</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ITEMS_PER_PAGE = 6;

const InventoryManagement: React.FC = () => {
    const { user } = useAuth();
    const [items, setItems] = useState<Barang[]>([...mockBarang]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Barang | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            (item.nama_alat.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'all' || item.status === statusFilter)
        ).sort((a,b) => b.id - a.id);
    }, [items, searchTerm, statusFilter]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    const handleSaveItem = (itemData: Omit<Barang, 'id' | 'created_at'>) => {
        if (itemToEdit) {
            const idx = mockBarang.findIndex(b => b.id === itemToEdit.id);
            if(idx !== -1) {
                mockBarang[idx] = { ...mockBarang[idx], ...itemData };
                addAuditLog(user!.id, user!.nama, 'Update Barang', `Mengubah data ${itemData.nama_alat}`, 'inventory');
                syncAllData();
                setItems([...mockBarang]);
            }
        } else {
            const newItem: Barang = {
                id: Math.max(0, ...mockBarang.map(i => i.id)) + 1,
                created_at: new Date().toISOString().split('T')[0],
                ...itemData
            };
            mockBarang.unshift(newItem);
            addAuditLog(user!.id, user!.nama, 'Tambah Barang', `Menambahkan ${newItem.nama_alat} ke inventaris`, 'inventory');
            syncAllData();
            setItems([...mockBarang]);
        }
    };

    const handleDeleteItem = (id: number) => {
        if (window.confirm('Yakin ingin menghapus barang ini dari database?')) {
            const idx = mockBarang.findIndex(b => b.id === id);
            if(idx !== -1) {
                const name = mockBarang[idx].nama_alat;
                mockBarang.splice(idx, 1);
                addAuditLog(user!.id, user!.nama, 'Hapus Barang', `Menghapus ${name} dari sistem`, 'inventory');
                syncAllData();
                setItems([...mockBarang]);
            }
        }
    };

    return (
        <div className="space-y-8 page-transition">
            <ItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} itemToEdit={itemToEdit} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Inventaris</h1>
                    <p className="text-slate-500 font-medium">Kelola kuantitas stok dan data aset UKM.</p>
                </div>
                <button 
                    onClick={() => { setItemToEdit(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
                >
                    <Plus size={20} /> Tambah Barang
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-[2rem] shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama alat atau merk..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)} 
                    className="px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold outline-none"
                >
                    <option value="all">Semua Status</option>
                    {Object.values(ItemStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aset</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori & Stok</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedItems.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img src={item.foto} className="w-16 h-16 object-cover rounded-2xl shadow-sm" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{item.nama_alat}</span>
                                            <span className="text-[10px] font-bold text-slate-400">{item.brand}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-600">{item.jenis}</span>
                                        <span className={`text-[11px] font-black uppercase tracking-wider ${item.stok > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            STOK: {item.stok} UNIT
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg ${
                                        item.status === ItemStatus.TERSEDIA ? 'bg-emerald-50 text-emerald-600' : 
                                        item.status === ItemStatus.DIPINJAM ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => { setItemToEdit(item); setIsModalOpen(true); }}
                                            className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
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

export default InventoryManagement;
