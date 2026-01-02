
export enum Role {
  ADMIN = 'admin',
  ANGGOTA = 'anggota',
}

export interface User {
  id: number;
  nama: string;
  username: string;
  gmail: string;
  role: Role;
  password?: string;
  nim?: string;
  profilePicture?: string;
  isActive: boolean;
}

export interface SystemSettings {
  adminContactName: string;
  adminContactEmail: string;
  adminContactPhone: string;
  organizationName: string;
  // Professional Policies
  maxItemsPerUser: number;
  maxLoanDurationDays: number;
  isRegistrationOpen: boolean;
  categories: string[];
}

export enum ItemStatus {
  TERSEDIA = 'Tersedia',
  DIPINJAM = 'Dipinjam',
  RUSAK = 'Rusak',
  DALAM_PERBAIKAN = 'Dalam Perbaikan',
}

export interface Barang {
  id: number;
  nama_alat: string;
  jenis: string;
  brand: string;
  seri: string;
  kondisi: string;
  status: ItemStatus;
  stok: number;
  catatan: string;
  foto: string;
  created_at: string;
}

export enum LoanStatus {
  MENUNGGU = 'Menunggu',
  DISETUJUI = 'Disetujui',
  DITOLAK = 'Ditolak',
  SELESAI = 'Selesai',
}

export interface Peminjaman {
  id: number;
  id_barang: number;
  id_user: number;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keterangan: string;
  status: LoanStatus;
  bukti_foto_pinjam: string;
  barang?: Barang;
  user?: User;
  tanggal_pengembalian_aktual?: string;
  kondisi_pengembalian?: string;
  bukti_foto_kembali?: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  userId: number;
  userName: string;
  action: string;
  details: string;
  type: 'loan' | 'inventory' | 'user' | 'system' | 'return';
}
