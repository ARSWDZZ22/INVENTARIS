
import { User, Role, Barang, ItemStatus, Peminjaman, LoanStatus, SystemSettings, AuditLog } from '../types';
import bcrypt from 'bcryptjs';

const USE_HASHED_PASSWORDS = true;

const loadData = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const initialUsers: User[] = [
  { id: 1, nama: 'Admin Stimbara', username: 'admin', gmail: 'admin@stimbara.ac.id', role: Role.ADMIN, password: 'adminpassword', nim: '00000000', profilePicture: 'https://i.pravatar.cc/150?u=admin', isActive: true },
  { id: 2, nama: 'Anggota Satu', username: 'anggota1', gmail: 'anggota1@stimbara.ac.id', role: Role.ANGGOTA, password: 'anggotapassword', nim: '12345678', profilePicture: 'https://i.pravatar.cc/150?u=anggota1', isActive: true },
];

const initialSettings: SystemSettings = {
  adminContactName: 'Admin Utama Inventaris',
  adminContactEmail: 'helpdesk.ukm@stimbara.ac.id',
  adminContactPhone: '+62 812-3456-7890',
  organizationName: 'UKM STIMBARA UISI',
  maxItemsPerUser: 5,
  maxLoanDurationDays: 14,
  isRegistrationOpen: true,
  categories: ['Peralatan Kemah', 'Tas & Ransel', 'Peralatan Masak', 'Peralatan Tidur', 'Pakaian & Safety']
};

const initialBarang: Barang[] = [
  { id: 1, nama_alat: 'Tenda Dome Kap. 4 Orang', jenis: 'Peralatan Kemah', brand: 'Eiger', seri: 'Equator', kondisi: 'Baik', status: ItemStatus.TERSEDIA, stok: 5, catatan: 'Tahan air, double layer', foto: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400', created_at: '2023-01-10' },
  { id: 2, nama_alat: 'Tas Carrier 60L', jenis: 'Tas & Ransel', brand: 'Deuter', seri: 'Aircontact Lite', kondisi: 'Baik', status: ItemStatus.TERSEDIA, stok: 3, catatan: 'Sudah termasuk rain cover', foto: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400', created_at: '2023-01-15' },
  { id: 3, nama_alat: 'Kompor Portable Camping', jenis: 'Peralatan Masak', brand: 'Kovar', seri: 'K-202', kondisi: 'Baik', status: ItemStatus.TERSEDIA, stok: 10, catatan: 'Bahan bakar gas kaleng', foto: 'https://images.unsplash.com/photo-1596434300155-2310a04965a0?auto=format&fit=crop&q=80&w=400', created_at: '2023-02-01' },
];

const initialPeminjaman: Peminjaman[] = [];
const initialAuditLogs: AuditLog[] = [
  { id: 1, timestamp: new Date().toISOString(), userId: 1, userName: 'Sistem', action: 'Inisialisasi', details: 'Sistem Inventaris Siap Digunakan', type: 'system' }
];

export let mockUsers: User[] = loadData('ukm_users', initialUsers);
export let mockBarang: Barang[] = loadData('ukm_barang', initialBarang);
export let mockPeminjaman: Peminjaman[] = loadData('ukm_peminjaman', initialPeminjaman);
export let mockSettings: SystemSettings = loadData('ukm_settings', initialSettings);
export let mockAuditLogs: AuditLog[] = loadData('ukm_audit_logs', initialAuditLogs);

const saveData = () => {
  localStorage.setItem('ukm_users', JSON.stringify(mockUsers));
  localStorage.setItem('ukm_barang', JSON.stringify(mockBarang));
  localStorage.setItem('ukm_peminjaman', JSON.stringify(mockPeminjaman));
  localStorage.setItem('ukm_settings', JSON.stringify(mockSettings));
  localStorage.setItem('ukm_audit_logs', JSON.stringify(mockAuditLogs));
};

export const addAuditLog = (userId: number, userName: string, action: string, details: string, type: AuditLog['type']) => {
  const newLog: AuditLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    details,
    type
  };
  mockAuditLogs.unshift(newLog);
  if (mockAuditLogs.length > 100) mockAuditLogs.pop();
  saveData();
};

export const updateBarangStock = (id: number, delta: number) => {
  const index = mockBarang.findIndex(b => b.id === id);
  if (index !== -1) {
    mockBarang[index].stok = Math.max(0, mockBarang[index].stok + delta);
    if (mockBarang[index].stok === 0) {
      mockBarang[index].status = ItemStatus.DIPINJAM;
    } else {
      mockBarang[index].status = ItemStatus.TERSEDIA;
    }
    saveData();
  }
};

export const updateSystemSettings = (newSettings: SystemSettings) => {
  mockSettings = { ...newSettings };
  saveData();
};

export const syncAllData = () => saveData();

// Ensure passwords are hashed in runtime if enabled
if (USE_HASHED_PASSWORDS) {
  let changed = false;
  mockUsers = mockUsers.map(u => {
    if (!u.password) return u;
    if (typeof u.password === 'string' && !u.password.startsWith('$2')) {
      const hashed = bcrypt.hashSync(u.password, 8);
      changed = true;
      return { ...u, password: hashed };
    }
    return u;
  });
  if (changed) saveData();
}
