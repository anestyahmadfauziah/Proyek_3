import { useState } from "react";
import {
  X,
  CalendarDays,
  Plus,
  Minus,
} from "lucide-react";

function TambahBahanModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    nama: "",
    kategori: "Sayuran",
    tanggalKadaluarsa: "",
    jumlah: 1,
    satuan: "pcs",
    harga: "",
    tanggalBeli: "",
  });

  const kategori = [
    { label: "Sayuran", icon: "🥬" },
    { label: "Buah-buahan", icon: "🍎" },
    { label: "Daging & Ikan", icon: "🥩" },
    { label: "Susu & Telur", icon: "🥚" },
    { label: "Karbohidrat", icon: "🍚" },
    { label: "Bumbu & Saus", icon: "🧄" },
    { label: "Siap Saji", icon: "🍱" },
    { label: "Lainnya", icon: "📦" },
  ];

  const satuan = [
    "pcs",
    "gram",
    "kg",
    "ml",
    "liter",
    "butir",
    "bungkus",
    "ikat",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJumlah = (value) => {
    setForm((prev) => ({
      ...prev,
      jumlah: Math.max(1, Number(prev.jumlah) + value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.nama ||
      !form.tanggalKadaluarsa ||
      !form.jumlah ||
      !form.satuan
    ) {
      alert("Mohon lengkapi data bahan terlebih dahulu.");
      return;
    }

    const today = new Date();
    const expiredDate = new Date(form.tanggalKadaluarsa);

    const selisihHari = Math.ceil(
      (expiredDate - today) / (1000 * 60 * 60 * 24)
    );

    const status = selisihHari <= 3 ? "Perlu diolah" : "Aman";

    const bahanBaru = {
      nama: form.nama,
      jumlah: `${form.jumlah} ${form.satuan}`,
      tanggal: new Date(form.tanggalKadaluarsa).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
      kategori: form.kategori,
      harga: form.harga,
      tanggalBeli: form.tanggalBeli,
      status,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80",
    };

    if (onSave) {
      onSave(bahanBaru);
    }

    onClose();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/35
        px-3
        py-4
        backdrop-blur-[2px]
        sm:px-5
      "
    >
      <div
        className="
          relative
          flex
          max-h-[94vh]
          w-full
          max-w-[720px]
          flex-col
          overflow-hidden
          rounded-[22px]
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            border-b
            border-slate-100
            px-5
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold
                text-[#202833]
                sm:text-xl
              "
            >
              Tambah Bahan Baru
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
                sm:text-sm
              "
            >
              Catat bahan agar stok kulkas lebih mudah dipantau.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-600
            "
            aria-label="Tutup"
          >
            <X size={21} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-y-auto
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >

          {/* NAMA BAHAN */}

          <div>
            <label
              htmlFor="nama"
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-[#34414c]
                sm:text-sm
              "
            >
              Nama Bahan <span className="text-red-500">*</span>
            </label>

            <input
              id="nama"
              name="nama"
              type="text"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Bayam Segar, Tempe, Telur Ayam..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3.5
                text-sm
                text-[#202833]
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#18a86b]
                focus:ring-2
                focus:ring-[#18a86b]/10
                sm:h-12
              "
            />
          </div>

          {/* KATEGORI */}

          <div className="mt-5">

            <label
              className="
                mb-2
                block
                text-xs
                font-semibold
                text-[#34414c]
                sm:text-sm
              "
            >
              Kategori <span className="text-red-500">*</span>
            </label>

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-4
              "
            >
              {kategori.map((item) => {
                const active = form.kategori === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        kategori: item.label,
                      }))
                    }
                    className={`
                      flex
                      min-h-[64px]
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      rounded-xl
                      border
                      px-2
                      py-2
                      text-[11px]
                      font-medium
                      transition
                      sm:min-h-[70px]
                      sm:text-xs
                      ${
                        active
                          ? "border-[#18b77a] bg-[#edfff7] text-[#176b48] ring-2 ring-[#18b77a]/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#b9dfcc] hover:bg-[#f7fcf9]"
                      }
                    `}
                  >
                    <span className="text-xl">
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TANGGAL + JUMLAH */}

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >

            {/* TANGGAL KADALUWARSA */}

            <div>
              <label
                htmlFor="tanggalKadaluarsa"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-[#34414c]
                  sm:text-sm
                "
              >
                Tanggal Kedaluwarsa
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">
                <input
                  id="tanggalKadaluarsa"
                  name="tanggalKadaluarsa"
                  type="date"
                  value={form.tanggalKadaluarsa}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    text-sm
                    text-[#202833]
                    outline-none
                    transition
                    focus:border-[#18a86b]
                    focus:ring-2
                    focus:ring-[#18a86b]/10
                    sm:h-12
                  "
                />

                <CalendarDays
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />
              </div>
            </div>

            {/* JUMLAH */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-[#34414c]
                  sm:text-sm
                "
              >
                Jumlah <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">

                <div
                  className="
                    flex
                    h-11
                    flex-1
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-200
                    px-2
                    sm:h-12
                  "
                >
                  <button
                    type="button"
                    onClick={() => handleJumlah(-1)}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-slate-100
                      text-slate-600
                      hover:bg-slate-200
                    "
                  >
                    <Minus size={15} />
                  </button>

                  <input
                    name="jumlah"
                    type="number"
                    min="1"
                    value={form.jumlah}
                    onChange={handleChange}
                    className="
                      w-16
                      border-0
                      text-center
                      text-sm
                      font-semibold
                      outline-none
                    "
                  />

                  <button
                    type="button"
                    onClick={() => handleJumlah(1)}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-slate-100
                      text-slate-600
                      hover:bg-slate-200
                    "
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <select
                  name="satuan"
                  value={form.satuan}
                  onChange={handleChange}
                  className="
                    h-11
                    w-[125px]
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    text-[#202833]
                    outline-none
                    focus:border-[#18a86b]
                    sm:h-12
                  "
                >
                  {satuan.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

              </div>
            </div>

          </div>

          {/* HARGA + TANGGAL BELI */}

          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >

            {/* HARGA */}

            <div>
              <label
                htmlFor="harga"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-[#34414c]
                  sm:text-sm
                "
              >
                Perkiraan Harga
              </label>

              <input
                id="harga"
                name="harga"
                type="number"
                value={form.harga}
                onChange={handleChange}
                placeholder="Contoh: 7000"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3.5
                  text-sm
                  outline-none
                  focus:border-[#18a86b]
                  focus:ring-2
                  focus:ring-[#18a86b]/10
                  sm:h-12
                "
              />

              <p className="mt-1.5 text-[10px] text-slate-400">
                Digunakan untuk menghitung total pengeluaran bahan.
              </p>
            </div>

            {/* TANGGAL BELI */}

            <div>
              <label
                htmlFor="tanggalBeli"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-[#34414c]
                  sm:text-sm
                "
              >
                Tanggal Beli
              </label>

              <div className="relative">

                <input
                  id="tanggalBeli"
                  name="tanggalBeli"
                  type="date"
                  value={form.tanggalBeli}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    text-sm
                    outline-none
                    focus:border-[#18a86b]
                    focus:ring-2
                    focus:ring-[#18a86b]/10
                    sm:h-12
                  "
                />

                <CalendarDays
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />

              </div>
            </div>

          </div>

          {/* PREVIEW CARD */}

          <div className="mt-5">

            <p
              className="
                mb-2
                text-xs
                font-semibold
                text-[#34414c]
              "
            >
              Preview di Dashboard
            </p>

            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-[#e4eee6]
                bg-[#f9fcf9]
                p-3
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#e5f4e8]
                  text-xl
                "
              >
                {kategori.find(
                  (item) => item.label === form.kategori
                )?.icon || "📦"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#202833]">
                  {form.nama || "Nama Bahan"}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  {form.jumlah || 0} {form.satuan}
                  {form.tanggalKadaluarsa && (
                    <>
                      <span className="mx-1">•</span>
                      {new Date(
                        form.tanggalKadaluarsa
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </>
                  )}
                </p>

                <p className="mt-1 text-[11px] font-semibold text-slate-600">
                  {form.tanggalKadaluarsa
                    ? (() => {
                        const today = new Date();
                        const exp = new Date(
                          form.tanggalKadaluarsa
                        );

                        const days = Math.ceil(
                          (exp - today) /
                            (1000 * 60 * 60 * 24)
                        );

                        return days <= 3
                          ? "Perlu diolah"
                          : "Aman";
                      })()
                    : "Status bahan"}
                </p>
              </div>
            </div>

          </div>

          {/* FOOTER */}

          <div
            className="
              mt-5
              flex
              flex-col-reverse
              gap-2
              border-t
              border-slate-100
              pt-4
              sm:flex-row
              sm:justify-end
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                h-10
                rounded-xl
                border
                border-slate-200
                px-5
                text-xs
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
                sm:h-11
                sm:text-sm
              "
            >
              Batal
            </button>

            <button
              type="submit"
              className="
                flex
                h-10
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-[#1d6b27]
                px-5
                text-xs
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[#155a1f]
                sm:h-11
                sm:text-sm
              "
            >
              <Plus size={17} />
              Simpan Bahan
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default TambahBahanModal;