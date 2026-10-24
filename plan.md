# Rencana: Patungan

## Tujuan
Satu halaman web di HP yang membagi tagihan makan (termasuk service, pajak, tip) secara rata ke semua orang, selesai dalam 15 detik.

## Bentuk
- Satu halaman statis: `index.html`, `style.css`, `script.js`. Tanpa framework, tanpa login, tanpa database.
- Logika hitung dipisah ke fungsi murni supaya bisa dites tanpa membuka browser.
- Deploy ke Cloudflare Pages dari repo ini.

## Aturan hitung (urutan wajib)
1. Service = total × persen service
2. Pajak = (total + service) × persen pajak
3. Grand total = total + service + pajak + tip
4. Per orang = grand total ÷ jumlah orang, dibulatkan ke atas ke Rp 500
5. Selisih = (per orang × jumlah orang) − grand total

Contoh uji: total 250.000, service 5%, pajak 10%, tip 0, 4 orang → grand total 288.750, per orang 72.500, lebih 1.250.

## Tampilan
- Semua di satu layar, hasil berubah langsung tanpa tombol "Hitung".
- Jumlah orang pakai tombol − dan + (minimal 1, default 2).
- Service: pilihan 0 / 5 / 10%. Pajak: pilihan 0 / 10%. Tip: isian Rupiah opsional.
- Angka per orang paling besar di layar, selisih pembulatan kecil di bawahnya.
- Tombol "Salin ke WhatsApp" menyalin rincian + nominal per orang.

## Urutan kerja
1. Fungsi hitung + tes (inti kebenaran).
2. Form input dan hasil langsung.
3. Rincian, pembulatan, selisih.
4. Tombol salin.
5. Rapikan tampilan HP, lalu deploy.

## Di luar cakupan versi 1
Bagi per menu, catatan siapa sudah bayar, transfer otomatis, login, simpan riwayat.

## Ukuran selesai
- Contoh uji di atas menghasilkan Rp 72.500.
- Dari buka halaman sampai salin hasil ≤ 15 detik di HP.
