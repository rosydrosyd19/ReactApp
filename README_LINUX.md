# Panduan Instalasi Aplikasi Asset Management di Ubuntu/Debian

Panduan ini menjelaskan langkah-langkah untuk menginstal dan menjalankan aplikasi Asset Management (React + Node.js + MySQL) pada sistem operasi Ubuntu atau Debian.

## Prasyarat

Pastikan sistem Anda sudah terupdate dan memiliki akses root/sudo.

### 1. Update Sistem
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js (Versi 18 atau terbaru)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```
Verifikasi instalasi:
```bash
node -v
npm -v
```

### 3. Install MySQL Server
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```
Jalankan keamanan dasar MySQL (opsional tapi disarankan):
```bash
sudo mysql_secure_installation
```

### 4. Install Git
```bash
sudo apt install -y git
```

---

## Langkah 1: Clone Repository

Salin kode sumber aplikasi ke server Anda.
```bash
git clone <repository_url>
cd ReactApp
```

---

## Langkah 2: Setup Database

Aplikasi ini membutuhkan database MySQL dengan struktur tabel tertentu. File `full_schema.sql` sudah disiapkan dan berisi semua tabel yang diperlukan.

### Import ke MySQL
Masuk ke MySQL dan import file `full_schema.sql`. Ganti `root` dengan user database Anda jika berbeda.

```bash
# Login ke MySQL shell
sudo mysql -u root -p

# Di dalam MySQL shell:
# SOURCE full_schema.sql;
# exit
```

Atau langsung dari terminal:
```bash
mysql -u root -p < full_schema.sql
```

---

## Langkah 3: Setup Backend (Server)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Konfigurasi Database
**PENTING**: Aplikasi saat ini menggunakan konfigurasi database hardcoded di `server/db.js`. Anda perlu menyesuaikannya dengan kredensial MySQL di server Anda.

Buka file `server/db.js`:
```bash
nano db.js
```

Ubah bagian berikut sesuai user dan password MySQL Anda:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Ganti dengan user database Anda
    password: 'password_anda', // Ganti dengan password database Anda
    database: 'asset_management_db'
});
```
*Catatan: Disarankan untuk menggunakan environment variables (.env) untuk keamanan yang lebih baik di masa depan.*

### 3. Setup Environment Variables
Buat file `.env` jika diperlukan oleh `server.js` (misalnya untuk PORT).
```bash
nano .env
```
Isi dengan:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=asset_management_db
```

### 4. Jalankan Server
Untuk pengujian:
```bash
npm start
```
Server akan berjalan di port 5000. Tekan `Ctrl+C` untuk berhenti.

---

## Langkah 4: Setup Frontend (Client)

Buka terminal baru atau kembali ke root folder.

### 1. Install Dependencies
```bash
cd ../client
npm install
```

### 2. Build Aplikasi
Compile kode React untuk production.
```bash
npm run build
```
Hasil build akan ada di folder `dist`.

### 3. Preview Aplikasi
Untuk menjalankan frontend secara sederhana:
```bash
npm run preview
```
Aplikasi akan berjalan (biasanya di port 4173).

---

## Langkah 5: Menjalankan Aplikasi di Background (Production)

Untuk menjalankan aplikasi terus-menerus (bahkan setelah logout), gunakan **PM2**.

### 1. Install PM2
```bash
sudo npm install -g pm2
```

### 2. Jalankan Backend
```bash
cd ../server
pm2 start server.js --name "asset-backend"
```

### 3. Jalankan Frontend
Untuk frontend, Anda bisa menggunakan `serve` untuk menyajikan folder `dist`.
```bash
sudo npm install -g serve
cd ../client
pm2 start "serve -s dist -l 3000" --name "asset-frontend"
```
Sekarang frontend berjalan di port 3000.

### 4. Simpan Konfigurasi PM2
Agar aplikasi otomatis jalan saat restart server:
```bash
pm2 save
pm2 startup
```
(Jalankan perintah yang ditampilkan oleh `pm2 startup`).

---

## Akses Aplikasi

Buka browser dan akses:
- **Frontend**: `http://IP_SERVER_ANDA:3000`
- **Backend API**: `http://IP_SERVER_ANDA:5000`

Pastikan firewall (UFW) mengizinkan port tersebut:
```bash
sudo ufw allow 3000
sudo ufw allow 5000
```
