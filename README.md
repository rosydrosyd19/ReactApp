# Asset Management App

Aplikasi manajemen aset profesional yang dibangun dengan React.js, Node.js/Express, dan MySQL. Terinspirasi dari Snipe-IT dengan arsitektur modular yang scalable.

## ✨ Fitur

### Asset Management
- 📦 **Assets** - Manajemen aset IT (laptop, PC, dll)
- 📍 **Locations** - Manajemen lokasi/kantor
- 👥 **Users** - Manajemen pengguna/karyawan
- 🔑 **Licenses** - Manajemen lisensi software
- 🔌 **Accessories** - Manajemen aksesori (mouse, keyboard, dll)
- 🧩 **Components** - Manajemen komponen (RAM, SSD, dll)
- 🔐 **Accounts** - Manajemen akun/kredensial

### System Administrator (New)
- 🛡️ **Role Management** - Manajemen role (Super Admin, Staff, dll)
- 🔒 **Permission Management** - Manajemen hak akses granular
- 🧩 **Module Management** - Manajemen modul aplikasi

### Core Features
- 📊 Dashboard dengan statistik real-time
- ✏️ CRUD lengkap untuk semua modul
- 🔄 Checkout/Checkin system untuk aset
- 📱 QR Code generation & bulk printing
- 🌓 Dark/Light mode
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 UI modern dengan Tailwind CSS
- 🔍 Search & filter functionality

## 🏗️ Arsitektur

### Database Structure (OPSI B - Naming Convention)

Database menggunakan **naming convention dengan prefix** untuk organisasi yang lebih baik:

#### Core Module (RBAC & Users)
- `core_users` - Data pengguna/karyawan
- `core_roles` - Data role
- `core_permissions` - Data permission
- `core_modules` - Data modul
- `core_user_roles` - Mapping user ke role
- `core_role_permissions` - Mapping role ke permission
- `core_role_modules` - Mapping role ke modul

#### Asset Management Module
- `asset_items` - Data aset utama
- `asset_locations` - Data lokasi
- `asset_licenses` - Data lisensi software
- `asset_accessories` - Data aksesori
- `asset_components` - Data komponen
- `asset_accounts` - Data akun/kredensial
- `asset_checkout_history` - Riwayat checkout aset
- `asset_license_assignments` - Assignment lisensi
- `asset_accessory_assignments` - Assignment aksesori
- `asset_component_assignments` - Assignment komponen
- `asset_account_assignments` - Assignment akun
- `asset_location_checkout_history` - Riwayat checkout lokasi
- `asset_maintenances` - Data maintenance aset

### Frontend Structure (OPSI A - Modular)

```
client/src/
├── modules/
│   ├── core/                    # Core module (Auth, Layout, Dashboard)
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── asset/                   # Asset Management module
│       ├── components/
│       └── pages/
│           ├── assets/
│           ├── locations/
│           ├── licenses/
│           ├── accessories/
│           ├── components/
│           ├── accounts/
│           └── users/
├── shared/                      # Shared utilities
└── App.jsx
```

### Backend Structure (OPSI A - Modular)

```
server/
├── modules/
│   ├── asset/
│   │   ├── routes/
│   │   └── controllers/
│   └── core/
│       ├── routes/
│       └── controllers/
├── shared/
│   ├── config/
│   ├── middleware/
│   └── utils/
└── server.js
```

## 🚀 Teknologi yang Digunakan

### Frontend
- **React.js 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Lucide React** - Icon library
- **QRCode.react** - QR code generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling

## 📋 Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (v16 atau lebih baru)
- [XAMPP](https://www.apachefriends.org/) (untuk MySQL)
- Git (untuk version control)

## 🔧 Instalasi dan Setup

### 1. Clone Repository

```bash
git clone https://github.com/rosydrosyd19/ReactApp.git
cd ReactApp
```

### 2. Persiapan Database

1. Jalankan XAMPP dan aktifkan **MySQL**

2. Import database schema:
   
   Buka terminal atau command prompt:
   ```bash
   mysql -u root < full_schema.sql
   ```
   
   *Catatan: `full_schema.sql` sudah berisi struktur tabel terbaru dan data awal (seed).*

### 3. Menjalankan Backend

1. Masuk ke folder `server`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan server:
   ```bash
   npm run dev
   ```

4. Server akan berjalan di `http://localhost:5000`

### 4. Menjalankan Frontend

1. Buka terminal baru, masuk ke folder `client`:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

4. Aplikasi akan berjalan di `http://localhost:5173`

### 5. Akses Aplikasi

Buka browser dan kunjungi `http://localhost:5173`

## 📡 API Endpoints

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### System Admin
- `GET /api/sysadmin/roles` - Get all roles
- `GET /api/sysadmin/permissions` - Get all permissions
- `POST /api/sysadmin/roles` - Create role

*(Dan endpoint lainnya untuk setiap modul)*

## ⚙️ Konfigurasi Database

Default konfigurasi database (di `server/shared/config/db.js`):
- **Host**: `localhost`
- **User**: `root`
- **Password**: `` (kosong)
- **Database**: `asset_management_db`

Jika konfigurasi MySQL Anda berbeda, edit file `server/shared/config/db.js`.

## 🚀 Roadmap

### Completed ✅
- ✅ Asset Management Module
- ✅ Location Management
- ✅ User Management
- ✅ License Management
- ✅ Accessory Management
- ✅ Component Management
- ✅ Account Management
- ✅ QR Code Generation & Bulk Printing
- ✅ Database Restructuring (Naming Convention)
- ✅ Code Restructuring (Modular Architecture)
- ✅ Role-Based Access Control (RBAC)
- ✅ System Admin Module

### Upcoming 🔜
- 🔜 **HR Module** - Employee management, attendance, leave, payroll
- 🔜 Advanced Reporting & Analytics
- 🔜 Email Notifications
- 🔜 Audit Logs
- 🔜 API Documentation (Swagger)
- 🔜 Unit & Integration Tests

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 Lisensi

MIT License

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Last Updated**: December 4, 2025
**Version**: 2.1.0 (RBAC Enabled)
**Status**: ✅ Production Ready



---do it ---

Tambahkan tombol sesuai permission user untuk user yang scan qrcode dan sudah melakukan login bila belum melakukan login tampilkan tombol login.