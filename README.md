# e-TAXZONE
E-learning Zona Pajak adalah platform pembelajaran berbasis web untuk mendukung proses pembelajaran pajak di **Politeknik Negeri Malang**.
Project ini menggunakan arsitektur **Fullstack JavaScript** dengan React di frontend dan Express di backend.

---

# Tech Stack

### Frontend
* React.js
* Material UI
* Redux

### Backend
* Node.js
* Express.js
* Sequelize ORM

### Database
* MySQL / MariaDB

---

# Project Structure

```
e-taxzone
│
├── database
│   └── etaxzone_db.sql
│
├── express-api
│   ├── routes
│   ├── models
│   ├── controllers
│   └── index.js
│
├── react-ui
│   ├── src
│   └── public
│
└── README.md
```

---

# Setup Backend
Masuk ke folder backend:

```
cd express-api
```

Install dependency:

```
npm install
```

Jalankan server:

```
npm run dev
```

Backend berjalan di:

```
http://localhost:8000
```

---

# Setup Frontend
Masuk ke folder frontend:

```
cd react-ui
```

Install dependency:

```
npm install --legacy-peer-deps
```

Jalankan React:

```
npm start
```

Frontend berjalan di:

```
http://localhost:3000
```

---

# Setup Database
1. Jalankan **XAMPP / MySQL**
2. Buka **phpMyAdmin**
3. Buat database:

```
etaxzone_db
```

4. Import file database:

```
database/etaxzone_db.sql
```

---

# Git Workflow

Cek perubahan project:

```
git status
```

Tambahkan perubahan:

```
git add .
```

Commit perubahan:

```
git commit -m "update fitur"
```

Push ke GitHub:

```
git push
```

---

# Dependency Maintenance
Beberapa command berikut berguna untuk menjaga dependency Node.js tetap bersih dan efisien.

### npm dedupe
Menghapus dependency yang duplikat di dalam `node_modules`.

```
npm dedupe
```

Jika beberapa package menggunakan dependency yang sama, npm akan mencoba menggabungkannya agar ukuran project lebih kecil.

---

### npm prune
Menghapus dependency yang tidak digunakan oleh project.

```
npm prune
```

Command ini memastikan hanya dependency yang ada di `package.json` yang tersisa di `node_modules`.

---

### npm cache verify
Memeriksa dan membersihkan cache npm jika ada file yang rusak.

```
npm cache verify
```

Cache npm digunakan untuk mempercepat proses install dependency, tetapi kadang perlu diperiksa untuk memastikan tidak ada cache yang corrupt.

---

# Clean Project (Optional)
Jika project menjadi terlalu besar, dependency bisa dihapus dan diinstall ulang.

```
rm -rf node_modules
npm cache clean --force
npm install
```
