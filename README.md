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

#### Core Module
- `core_users` - Data pengguna/karyawan

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

### Frontend Structure (OPSI A - Modular)

```
client/src/
├── modules/
│   ├── core/                    # Core module
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   └── pages/
│   │       └── Dashboard.jsx
│   └── asset/                   # Asset Management module
│       ├── components/
│       │   └── BulkQRPrintModal.jsx
│       └── pages/
│           ├── assets/          # Asset pages
│           ├── locations/       # Location pages
│           ├── licenses/        # License pages
│           ├── accessories/     # Accessory pages
│           ├── components/      # Component pages
│           ├── accounts/        # Account pages
│           └── users/           # User pages
├── shared/                      # Shared utilities
│   ├── components/
│   └── utils/
└── App.jsx
```

### Backend Structure (OPSI A - Modular)

```
server/
├── modules/
│   ├── asset/
│   │   ├── routes/
│   │   │   └── asset.routes.js
│   │   └── controllers/
│   │       └── asset.controller.js
│   └── core/
│       ├── routes/
│       └── controllers/
├── shared/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── upload.js
│   └── utils/
├── routes/                      # Legacy routes (still active)
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

2. Buka terminal di folder `server`:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Jalankan database migration (untuk struktur baru):
   ```bash
   node run_migration_rename.js
   ```
   
   **ATAU** jalankan seed script (untuk setup awal):
   ```bash
   node seed.js
   ```

### 3. Menjalankan Backend

1. Pastikan Anda berada di folder `server`:
   ```bash
   cd server
   ```

2. Jalankan server:
   ```bash
   npm run dev
   ```

3. Server akan berjalan di `http://localhost:5000`

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
- `POST /api/assets` - Create new asset (with image upload)
- `PUT /api/assets/:id` - Update asset (with image upload)
- `DELETE /api/assets/:id` - Delete asset
- `POST /api/assets/:id/checkout` - Checkout asset
- `POST /api/assets/:id/checkin` - Checkin asset
- `GET /api/assets/:id/history` - Get checkout history
- `GET /api/assets/:id/licenses` - Get assigned licenses
- `GET /api/assets/:id/accessories` - Get assigned accessories
- `GET /api/assets/:id/components` - Get assigned components
- `GET /api/assets/:id/accounts` - Get assigned accounts

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `POST /api/locations` - Create new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location
- `POST /api/locations/:id/checkout` - Checkout location
- `POST /api/locations/:id/checkin` - Checkin location

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Licenses
- `GET /api/licenses` - Get all licenses
- `GET /api/licenses/:id` - Get license by ID
- `POST /api/licenses` - Create new license
- `PUT /api/licenses/:id` - Update license
- `DELETE /api/licenses/:id` - Delete license
- `POST /api/licenses/:id/assign` - Assign license
- `POST /api/licenses/:id/return` - Return license

### Accessories
- `GET /api/accessories` - Get all accessories
- `GET /api/accessories/:id` - Get accessory by ID
- `POST /api/accessories` - Create new accessory (with image upload)
- `PUT /api/accessories/:id` - Update accessory (with image upload)
- `DELETE /api/accessories/:id` - Delete accessory
- `POST /api/accessories/:id/checkout` - Checkout accessory
- `POST /api/accessories/:id/checkin` - Checkin accessory

### Components
- `GET /api/components` - Get all components
- `GET /api/components/:id` - Get component by ID
- `POST /api/components` - Create new component
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component
- `POST /api/components/:id/assign` - Assign component

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `POST /api/accounts/:id/assign` - Assign account

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## ⚙️ Konfigurasi Database

Default konfigurasi database (di `server/shared/config/db.js`):
- **Host**: `localhost`
- **User**: `root`
- **Password**: `` (kosong)
- **Database**: `asset_management_db`

Jika konfigurasi MySQL Anda berbeda, edit file `server/shared/config/db.js`.

## 🔄 Database Migration

Jika Anda sudah memiliki database lama dan ingin migrate ke struktur baru:

```bash
cd server
node run_migration_rename.js
```

Untuk rollback jika terjadi masalah:

```bash
mysql -u root asset_management_db < rollback_rename_tables.sql
```

## 📝 Dokumentasi Tambahan

- **RESTRUCTURING_SUMMARY.md** - Ringkasan restructuring yang telah dilakukan
- **implementation_plan.md** - Rencana implementasi detail
- **walkthrough.md** - Walkthrough lengkap proses restructuring

## 🐛 Troubleshooting

### Port sudah digunakan
Jika port 5000 atau 5173 sudah digunakan:
- Matikan aplikasi yang menggunakan port tersebut
- Atau ubah port di `server/server.js` (backend)
- Vite akan otomatis mencari port lain untuk frontend

### MySQL tidak terkoneksi
- Pastikan XAMPP MySQL sudah berjalan
- Periksa konfigurasi di `server/shared/config/db.js`
- Pastikan database `asset_management_db` sudah dibuat
- Cek username dan password MySQL

### Dark mode tidak berfungsi
- Refresh halaman browser
- Clear cache browser
- Periksa localStorage browser

### Import errors setelah restructuring
- Pastikan semua dependencies sudah terinstall: `npm install`
- Clear node_modules dan reinstall: `rm -rf node_modules && npm install`
- Restart dev server

### Database table not found
- Pastikan migration sudah dijalankan: `node run_migration_rename.js`
- Atau jalankan seed script: `node seed.js`
- Cek apakah tabel menggunakan prefix baru (`asset_*`, `core_*`)

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

### Upcoming 🔜
- 🔜 **HR Module** - Employee management, attendance, leave, payroll
- 🔜 Authentication & Authorization
- 🔜 Role-based Access Control (RBAC)
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

**Last Updated**: November 28, 2025
**Version**: 2.0.0 (Restructured)
**Status**: ✅ Production Ready

perbaiki halaman components detail masih belum ada atau belum muncul 

fitur delete Maintenance History masih error 
XHRDELETE
http://localhost:5000/api/assets/maintenance/1
[HTTP/1.1 404 Not Found 6ms]
Error deleting maintenance: 
Object { message: "Request failed with status code 404", name: "AxiosError", code: "ERR_BAD_REQUEST", config: {…}, request: XMLHttpRequest, response: {…}, status: 404, stack: "", … }
AssetDetail.jsx:108:25

fitur edit Maintenance History masih error 
XHRPUT
http://localhost:5000/api/assets/maintenance/1
[HTTP/1.1 404 Not Found 2ms]
Error saving maintenance record: 
Object { message: "Request failed with status code 404", name: "AxiosError", code: "ERR_BAD_REQUEST", config: {…}, request: XMLHttpRequest, response: {…}, status: 404, stack: "", … }
MaintenanceForm.jsx:37:21

perbaiki tampilan Add Maintenance Record bagian atas dan bawah terpotong halam website untuk tampilan mobile tombol terpotong