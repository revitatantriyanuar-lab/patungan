// Logika hitung Patungan. Fungsi murni: tidak menyentuh tampilan,
// supaya bisa dites tanpa membuka browser.
//
// Urutan wajib (lihat plan.md):
//   1. Service     = total × persen service
//   2. Pajak       = (total + service) × persen pajak
//   3. Grand total = total + service + pajak + tip
//
// Semua nilai dalam Rupiah utuh. Service dan pajak dibulatkan ke
// Rupiah terdekat supaya tidak muncul angka seperti 12.499,999999.

function hitungTagihan({ total, persenService = 0, persenPajak = 0, tip = 0 }) {
  const service = Math.round((total * persenService) / 100);
  const pajak = Math.round(((total + service) * persenPajak) / 100);
  const grandTotal = total + service + pajak + tip;
  return { subtotal: total, service, pajak, tip, grandTotal };
}

// Bagi grand total ke semua orang.
//   4. Per orang = grand total ÷ jumlah orang, dibulatkan KE ATAS ke Rp 500
//   5. Selisih   = (per orang × jumlah orang) − grand total
// Dibulatkan ke atas supaya tidak ada yang nombok. Selisihnya
// ditampilkan agar semua orang tahu ada kelebihan berapa.
const KELIPATAN = 500;

function bagiRata(grandTotal, jumlahOrang) {
  const perOrang = Math.ceil(grandTotal / jumlahOrang / KELIPATAN) * KELIPATAN;
  const selisih = perOrang * jumlahOrang - grandTotal;
  return { perOrang, selisih };
}

// Bisa dipakai di Node (untuk tes) maupun langsung di browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { hitungTagihan, bagiRata, KELIPATAN };
}
