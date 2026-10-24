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

// ---- Validasi input ----
// Input dari layar bisa berupa teks ("250.000", "Rp 250.000", "")
// atau angka. Aturannya:
//   - kosong atau bukan angka → 0
//   - negatif → ditolak, dianggap 0
//   - Rupiah selalu bilangan bulat (titik dan koma ribuan diabaikan)

function bacaRupiah(nilai) {
  if (typeof nilai === "number") {
    return Number.isFinite(nilai) && nilai > 0 ? Math.round(nilai) : 0;
  }
  const teks = String(nilai ?? "").trim();
  if (teks.startsWith("-")) return 0;
  const angka = teks.replace(/\D/g, "");
  return angka === "" ? 0 : Number(angka);
}

// Jumlah orang minimal 1 dan selalu bilangan bulat.
function bacaJumlahOrang(nilai) {
  const n = Math.floor(Number(nilai));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

// Persen dibatasi 0 sampai 100.
function bacaPersen(nilai) {
  const p = Number(nilai);
  if (!Number.isFinite(p) || p < 0) return 0;
  return Math.min(p, 100);
}

// Satu pintu untuk layar: terima input mentah, kembalikan semua angka
// yang perlu ditampilkan. Hasilnya tidak pernah NaN.
function hitungSemua(input = {}) {
  const tagihan = hitungTagihan({
    total: bacaRupiah(input.total),
    persenService: bacaPersen(input.persenService),
    persenPajak: bacaPersen(input.persenPajak),
    tip: bacaRupiah(input.tip),
  });
  const jumlahOrang = bacaJumlahOrang(input.jumlahOrang);
  return { ...tagihan, jumlahOrang, ...bagiRata(tagihan.grandTotal, jumlahOrang) };
}

// Bisa dipakai di Node (untuk tes) maupun langsung di browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    hitungTagihan, bagiRata, KELIPATAN,
    bacaRupiah, bacaJumlahOrang, bacaPersen, hitungSemua,
  };
}
