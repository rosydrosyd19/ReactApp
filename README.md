# Asset Management App

Aplikasi manajemen aset sederhana yang dibangun dengan React.js, Node.js/Express, dan MySQL. Terinspirasi dari Snipe-IT.

## Fitur

- 📊 Dashboard dengan statistik aset
- ✏️ CRUD (Create, Read, Update, Delete) untuk aset
- 🌓 Mode gelap/terang
- 📱 Desain responsif
- 🎨 UI modern dengan Tailwind CSS

## Teknologi yang Digunakan

### Frontend
- React.js 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Chart.js
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MySQL2
- CORS

## Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (v16 atau lebih baru)
- [XAMPP](https://www.apachefriends.org/) (untuk MySQL)

## Instalasi dan Menjalankan Aplikasi

### 1. Persiapan Database

1. Jalankan XAMPP dan aktifkan **MySQL**
2. Buka terminal di folder `server`:
   ```bash
   cd server
   ```
3. Jalankan script untuk membuat database dan tabel:
   ```bash
   node seed.js
   ```

### 2. Menjalankan Backend

1. Pastikan Anda berada di folder `server`:
   ```bash
   cd server
   ```
2. Install dependencies (jika belum):
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm run dev
   ```
4. Server akan berjalan di `http://localhost:5000`

### 3. Menjalankan Frontend

1. Buka terminal baru, masuk ke folder `client`:
   ```bash
   cd client
   ```
2. Install dependencies (jika belum):
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
4. Aplikasi akan berjalan di `http://localhost:5173` atau `http://localhost:5174`

### 4. Akses Aplikasi

Buka browser dan kunjungi URL yang ditampilkan di terminal (biasanya `http://localhost:5173`).

## Struktur Folder

```
asset-management-app/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Komponen React
│   │   ├── pages/         # Halaman aplikasi
│   │   ├── context/       # Context API (Theme)
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                 # Backend Express
│   ├── routes/            # API routes
│   ├── db.js              # Koneksi database
│   ├── server.js          # Entry point
│   ├── seed.js            # Database seeder
│   └── package.json
└── database.sql           # SQL schema (opsional)
```

## API Endpoints

### Assets
- `GET /api/assets` - Mendapatkan semua aset
- `GET /api/assets/:id` - Mendapatkan aset berdasarkan ID
- `POST /api/assets` - Membuat aset baru
- `PUT /api/assets/:id` - Update aset
- `DELETE /api/assets/:id` - Hapus aset

### Dashboard
- `GET /api/dashboard` - Mendapatkan statistik dashboard

## Konfigurasi Database

Default konfigurasi database (di `server/db.js`):
- Host: `localhost`
- User: `root`
- Password: `` (kosong)
- Database: `asset_management_db`

Jika konfigurasi MySQL Anda berbeda, edit file `server/db.js`.

## Troubleshooting

### Port sudah digunakan
Jika port 5000 atau 5173 sudah digunakan, Anda bisa:
- Matikan aplikasi yang menggunakan port tersebut
- Atau ubah port di `server/server.js` (backend) dan Vite akan otomatis mencari port lain (frontend)

### MySQL tidak terkoneksi
- Pastikan XAMPP MySQL sudah berjalan
- Periksa konfigurasi di `server/db.js`
- Pastikan database `asset_management_db` sudah dibuat

### Dark mode tidak berfungsi
- Refresh halaman browser
- Clear cache browser

## Lisensi

MIT License
# ReactApp

