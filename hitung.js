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

// ---- Teks untuk grup WhatsApp ----
// Ringkas dan rapi saat ditempel. *teks* jadi tebal di WhatsApp.
// Baris service, pajak, dan tip hanya muncul kalau nilainya ada.
function buatPesan(hasil, persenService = 0, persenPajak = 0) {
  const rp = (n) => "Rp " + n.toLocaleString("id-ID");
  const baris = ["*Patungan makan bareng*", `Subtotal: ${rp(hasil.subtotal)}`];
  if (hasil.service > 0) baris.push(`Service ${persenService}%: ${rp(hasil.service)}`);
  if (hasil.pajak > 0) baris.push(`Pajak ${persenPajak}%: ${rp(hasil.pajak)}`);
  if (hasil.tip > 0) baris.push(`Tip: ${rp(hasil.tip)}`);
  baris.push(`Total: ${rp(hasil.grandTotal)}`);
  baris.push("");
  baris.push(`Dibagi ${hasil.jumlahOrang} orang: *${rp(hasil.perOrang)}/orang*`);
  if (hasil.selisih > 0) baris.push(`(dibulatkan ke atas, lebih ${rp(hasil.selisih)})`);
  return baris.join("\n");
}

// Bisa dipakai di Node (untuk tes) maupun langsung di browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    hitungTagihan, bagiRata, KELIPATAN,
    bacaRupiah, bacaJumlahOrang, bacaPersen, hitungSemua, buatPesan,
  };
}
