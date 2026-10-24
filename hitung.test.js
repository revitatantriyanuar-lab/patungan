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
