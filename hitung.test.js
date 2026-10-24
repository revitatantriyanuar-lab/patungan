// Jalankan dengan: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const { hitungTagihan } = require("./hitung.js");

test("contoh uji utama: service dihitung dulu, pajak setelah service", () => {
  const hasil = hitungTagihan({ total: 250000, persenService: 5, persenPajak: 10, tip: 0 });
  assert.equal(hasil.service, 12500);
  assert.equal(hasil.pajak, 26250);
  assert.equal(hasil.grandTotal, 288750);
});

test("pajak tidak dihitung dari total saja (urutan terbalik akan salah)", () => {
  const hasil = hitungTagihan({ total: 250000, persenService: 5, persenPajak: 10 });
  // Kalau pajak dihitung dari 250.000 saja, hasilnya 25.000. Itu salah.
  assert.notEqual(hasil.pajak, 25000);
});

test("tanpa service dan pajak, grand total sama dengan total", () => {
  const hasil = hitungTagihan({ total: 100000 });
  assert.equal(hasil.service, 0);
  assert.equal(hasil.pajak, 0);
  assert.equal(hasil.grandTotal, 100000);
});

test("tip ditambahkan setelah service dan pajak, tidak ikut kena pajak", () => {
  const hasil = hitungTagihan({ total: 200000, persenService: 0, persenPajak: 10, tip: 20000 });
  assert.equal(hasil.pajak, 20000);
  assert.equal(hasil.grandTotal, 240000);
});

test("angka pecahan dibulatkan ke Rupiah terdekat", () => {
  // 5% dari 123.457 = 6.172,85 → 6.173
  const hasil = hitungTagihan({ total: 123457, persenService: 5, persenPajak: 0 });
  assert.equal(hasil.service, 6173);
  assert.ok(Number.isInteger(hasil.grandTotal));
});

// ---- Tugas 2: pembulatan per orang dan selisih ----
const { bagiRata } = require("./hitung.js");

test("contoh uji utama: 4 orang → 72.500, lebih 1.250", () => {
  const { grandTotal } = hitungTagihan({ total: 250000, persenService: 5, persenPajak: 10 });
  const hasil = bagiRata(grandTotal, 4);
  assert.equal(hasil.perOrang, 72500);
  assert.equal(hasil.selisih, 1250);
});

test("pas habis dibagi: 100.000 untuk 4 orang → 25.000, selisih 0", () => {
  assert.deepEqual(bagiRata(100000, 4), { perOrang: 25000, selisih: 0 });
});

test("selalu dibulatkan ke atas, tidak pernah ke bawah", () => {
  // 100.001 ÷ 4 = 25.000,25 → harus 25.500, bukan 25.000
  assert.equal(bagiRata(100001, 4).perOrang, 25500);
});

test("hasil per orang selalu kelipatan 500 dan total terkumpul tidak kurang", () => {
  for (const [gt, n] of [[288750, 4], [287500, 6], [99999, 3], [1, 1], [513000, 7]]) {
    const { perOrang, selisih } = bagiRata(gt, n);
    assert.equal(perOrang % 500, 0);
    assert.ok(perOrang * n >= gt);
    assert.ok(selisih >= 0 && selisih < 500 * n);
  }
});

test("satu orang membayar grand total yang sudah dibulatkan", () => {
  assert.deepEqual(bagiRata(288750, 1), { perOrang: 289000, selisih: 250 });
});

// ---- Tugas 3: validasi input ----
const { bacaRupiah, bacaJumlahOrang, bacaPersen, hitungSemua } = require("./hitung.js");

test("jumlah orang minimal 1: 0, negatif, dan kosong jadi 1", () => {
  for (const n of [0, -3, "", null, undefined, "abc"]) {
    assert.equal(bacaJumlahOrang(n), 1);
  }
  assert.equal(bacaJumlahOrang(4), 4);
  assert.equal(bacaJumlahOrang("6"), 6);
});

test("total kosong menghasilkan Rp 0, bukan NaN", () => {
  for (const t of ["", null, undefined, "abc"]) {
    const hasil = hitungSemua({ total: t, jumlahOrang: 4 });
    assert.equal(hasil.grandTotal, 0);
    assert.equal(hasil.perOrang, 0);
    assert.equal(hasil.selisih, 0);
  }
});

test("angka negatif ditolak", () => {
  assert.equal(bacaRupiah(-50000), 0);
  assert.equal(bacaRupiah("-50.000"), 0);
  assert.equal(bacaPersen(-10), 0);
});

test("format Rupiah dari layar dibaca dengan benar", () => {
  assert.equal(bacaRupiah("250.000"), 250000);
  assert.equal(bacaRupiah("Rp 250.000"), 250000);
  assert.equal(bacaRupiah("1,250,000"), 1250000);
});

test("persen di atas 100 dibatasi 100", () => {
  assert.equal(bacaPersen(150), 100);
  assert.equal(bacaPersen("10"), 10);
});

test("hitungSemua dengan input mentah memberi hasil contoh uji", () => {
  const hasil = hitungSemua({ total: "250.000", jumlahOrang: "4", persenService: "5", persenPajak: "10", tip: "" });
  assert.equal(hasil.grandTotal, 288750);
  assert.equal(hasil.perOrang, 72500);
  assert.equal(hasil.selisih, 1250);
});

test("tidak ada input sama sekali tetap aman", () => {
  const hasil = hitungSemua();
  for (const v of Object.values(hasil)) assert.ok(Number.isFinite(v));
  assert.equal(hasil.jumlahOrang, 1);
});

// ---- Tugas 7: teks untuk WhatsApp ----
const { buatPesan } = require("./hitung.js");

test("pesan WA untuk contoh uji berisi rincian dan nominal per orang", () => {
  const hasil = hitungSemua({ total: 250000, jumlahOrang: 4, persenService: 5, persenPajak: 10 });
  assert.equal(buatPesan(hasil, 5, 10), [
    "*Patungan makan bareng*",
    "Subtotal: Rp 250.000",
    "Service 5%: Rp 12.500",
    "Pajak 10%: Rp 26.250",
    "Total: Rp 288.750",
    "",
    "Dibagi 4 orang: *Rp 72.500/orang*",
    "(dibulatkan ke atas, lebih Rp 1.250)",
  ].join("\n"));
});

test("pesan WA tanpa service, pajak, tip, dan selisih tetap ringkas", () => {
  const hasil = hitungSemua({ total: 100000, jumlahOrang: 4 });
  const pesan = buatPesan(hasil);
  assert.ok(!pesan.includes("Service"));
  assert.ok(!pesan.includes("Pajak"));
  assert.ok(!pesan.includes("Tip"));
  assert.ok(!pesan.includes("lebih"));
  assert.ok(pesan.includes("*Rp 25.000/orang*"));
});

test("tip muncul di pesan kalau diisi", () => {
  const hasil = hitungSemua({ total: 200000, jumlahOrang: 2, tip: 20000 });
  assert.ok(buatPesan(hasil).includes("Tip: Rp 20.000"));
});
