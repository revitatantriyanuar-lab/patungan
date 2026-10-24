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

  const salin = $("salin");
  const cadangan = $("salin-cadangan");

  const MAKS_ORANG = 50;
  const LABEL_SALIN = "Salin ke WhatsApp";
  let jumlahOrang = 2;
  let pesanTerakhir = "";
  let timerSalin;

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

    // Rincian, supaya bisa dicocokkan dengan struk
    $("r-subtotal").textContent = rupiah(hasil.subtotal);
    $("r-service-label").textContent = `Service ${pilihan("service")}%`;
    $("r-service").textContent = rupiah(hasil.service);
    $("r-pajak-label").textContent = `Pajak ${pilihan("pajak")}%`;
    $("r-pajak").textContent = rupiah(hasil.pajak);
    $("r-tip").textContent = rupiah(hasil.tip);
    $("r-total").textContent = rupiah(hasil.grandTotal);

    perOrang.textContent = "Rp " + rupiah(hasil.perOrang);
    if (hasil.grandTotal === 0) {
      selisih.textContent = "Isi total tagihan untuk mulai";
    } else if (hasil.selisih === 0) {
      selisih.textContent = "Pas, tidak ada kelebihan";
    } else {
      selisih.textContent = `Dibulatkan ke atas, lebih Rp ${rupiah(hasil.selisih)}`;
    }

    pesanTerakhir = buatPesan(hasil, pilihan("service"), pilihan("pajak"));
    salin.disabled = hasil.grandTotal === 0;
    if (!cadangan.hidden) cadangan.value = pesanTerakhir;
  }

  function tandaiTersalin(teks) {
    salin.textContent = teks;
    clearTimeout(timerSalin);
    timerSalin = setTimeout(() => { salin.textContent = LABEL_SALIN; }, 2000);
  }

  // Kalau peramban menolak menyalin otomatis, tampilkan teksnya
  // dalam keadaan terpilih supaya bisa disalin manual.
  function tampilkanCadangan() {
    cadangan.hidden = false;
    cadangan.value = pesanTerakhir;
    cadangan.focus();
    cadangan.select();
    tandaiTersalin("Tekan lama teks di bawah, lalu Salin");
  }

  salin.addEventListener("click", () => {
    if (!pesanTerakhir || salin.disabled) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pesanTerakhir)
        .then(() => tandaiTersalin("Tersalin! Tempel di grup WA"))
        .catch(tampilkanCadangan);
    } else {
      tampilkanCadangan();
    }
  });

  total.addEventListener("input", () => { rapikanRupiah(total); perbarui(); });
  tip.addEventListener("input", () => { rapikanRupiah(tip); perbarui(); });
  form.addEventListener("change", perbarui);
  form.addEventListener("submit", (e) => { e.preventDefault(); document.activeElement.blur(); });

  kurang.addEventListener("click", () => { jumlahOrang = Math.max(1, jumlahOrang - 1); perbarui(); });
  tambah.addEventListener("click", () => { jumlahOrang = Math.min(MAKS_ORANG, jumlahOrang + 1); perbarui(); });

  perbarui();
})();
