# Patungan

Bagi tagihan makan bareng, termasuk service dan pajak, secara adil ke semua peserta dalam 15 detik.

Lihat [BRIEF.md](BRIEF.md) untuk tujuan, [plan.md](plan.md) untuk rencana, dan [tasks.md](tasks.md) untuk daftar tugas.

## Cara pakai

1. Ketik total tagihan.
2. Atur jumlah orang dengan tombol − dan +.
3. Pilih persen service dan pajak sesuai struk. Isi tip kalau ada.
4. Hasil per orang langsung muncul. Tekan **Salin ke WhatsApp**, lalu tempel di grup.

Urutan hitung: service dari total, pajak dari total + service, lalu hasil per orang dibulatkan ke atas ke Rp 500.

## Isi repo

| File | Isi |
|---|---|
| `index.html` | Halaman app |
| `style.css` | Tampilan, mode terang dan gelap |
| `script.js` | Menghubungkan tampilan dengan logika hitung |
| `hitung.js` | Logika hitung, pembulatan, validasi, dan teks WhatsApp |
| `hitung.test.js` | Tes otomatis untuk `hitung.js` |

Tidak ada build step dan tidak ada dependensi.

## Menjalankan tes

Butuh Node.js 18 atau lebih baru:

```
node --test
```

## Deploy

Situs ini statis dan di-deploy lewat Cloudflare Pages yang tersambung ke repo ini. Setiap merge ke `main` otomatis memperbarui situs.

Pengaturan build di Cloudflare:
- Framework preset: None
- Build command: (kosong)
- Build output directory: `/`
