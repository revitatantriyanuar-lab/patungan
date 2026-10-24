# Tugas (urut dari yang paling penting)

Setiap tugas punya cara cek yang jelas. Kerjakan berurutan.

1. **Fungsi hitung dasar**
   Buat fungsi yang menerima total, persen service, persen pajak, tip, dan jumlah orang, lalu mengembalikan service, pajak, dan grand total dengan urutan pajak setelah service.
   *Cek:* total 250.000, service 5%, pajak 10%, tip 0 → service 12.500, pajak 26.250, grand total 288.750.

2. **Pembulatan per orang dan selisih**
   Bagi grand total ke jumlah orang, bulatkan ke atas ke Rp 500, hitung selisihnya.
   *Cek:* contoh di atas dengan 4 orang → per orang 72.500, selisih 1.250. Grand total 100.000 untuk 4 orang → 25.000, selisih 0.

3. **Validasi input**
   Jumlah orang minimal 1; total kosong atau 0 menghasilkan 0 tanpa error; angka negatif ditolak.
   *Cek:* 0 orang tidak bisa dipilih; total kosong menampilkan Rp 0, bukan "NaN".

4. **Form input satu layar**
   Isian total (keyboard angka), tombol − / + jumlah orang, pilihan service 0/5/10%, pajak 0/10%, isian tip.
   *Cek:* di HP, keyboard angka muncul saat mengetik total; tombol − berhenti di 1.

5. **Hasil langsung tanpa tombol Hitung**
   Angka per orang dan rincian berubah setiap kali input berubah.
   *Cek:* masukkan contoh uji, angka 72.500 muncul tanpa menekan tombol apa pun.

6. **Rincian tagihan**
   Tampilkan subtotal, service, pajak, tip, grand total dengan format ribuan Rupiah.
   *Cek:* rincian untuk contoh uji cocok dengan angka di tugas 1.

7. **Tombol "Salin ke WhatsApp"**
   Menyalin teks ringkas berisi rincian dan nominal per orang.
   *Cek:* tempel di WhatsApp, teks terbaca rapi dan angkanya sama dengan layar.

8. **Rapikan tampilan HP dan deploy ke Cloudflare Pages**
   *Cek:* halaman terbuka lewat link Cloudflare di HP, semua muat satu layar, dan alur dari buka sampai salin ≤ 15 detik.
