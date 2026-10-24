// Menghubungkan tampilan dengan hitung.js.
// Semua perhitungan lewat hitungSemua(); file ini hanya membaca input
// dan menulis hasil ke layar, setiap kali ada perubahan (tanpa tombol Hitung).

(function () {
  const $ = (id) => document.getElementById(id);
  const form = $("form");
  const total = $("total");
  const tip = $("tip");
  const orang = $("orang");
  const kurang = $("kurang");
  const tambah = $("tambah");
  const perOrang = $("per-orang");
  const selisih = $("selisih");

  const MAKS_ORANG = 50;
  let jumlahOrang = 2;

  const rupiah = (n) => n.toLocaleString("id-ID");

  // Tampilkan titik ribuan saat mengetik: 250000 → 250.000
  function rapikanRupiah(input) {
    const angka = bacaRupiah(input.value);
    input.value = angka === 0 ? "" : rupiah(angka);
  }

  function pilihan(nama) {
    const terpilih = form.querySelector(`input[name="${nama}"]:checked`);
    return terpilih ? terpilih.value : 0;
  }

  function perbarui() {
    const hasil = hitungSemua({
      total: total.value,
      jumlahOrang,
      persenService: pilihan("service"),
      persenPajak: pilihan("pajak"),
      tip: tip.value,
    });

    orang.textContent = hasil.jumlahOrang;
    kurang.disabled = hasil.jumlahOrang <= 1;
    tambah.disabled = hasil.jumlahOrang >= MAKS_ORANG;

    perOrang.textContent = "Rp " + rupiah(hasil.perOrang);
    if (hasil.grandTotal === 0) {
      selisih.textContent = "Isi total tagihan untuk mulai";
    } else if (hasil.selisih === 0) {
      selisih.textContent = "Pas, tidak ada kelebihan";
    } else {
      selisih.textContent = `Dibulatkan ke atas, lebih Rp ${rupiah(hasil.selisih)}`;
    }
  }

  total.addEventListener("input", () => { rapikanRupiah(total); perbarui(); });
  tip.addEventListener("input", () => { rapikanRupiah(tip); perbarui(); });
  form.addEventListener("change", perbarui);
  form.addEventListener("submit", (e) => { e.preventDefault(); document.activeElement.blur(); });

  kurang.addEventListener("click", () => { jumlahOrang = Math.max(1, jumlahOrang - 1); perbarui(); });
  tambah.addEventListener("click", () => { jumlahOrang = Math.min(MAKS_ORANG, jumlahOrang + 1); perbarui(); });

  perbarui();
})();
