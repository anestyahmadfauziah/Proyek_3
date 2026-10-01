function KartuFitur({ icon, judul, badge, deskripsi }) {
  return (
    <div className="flex w-full items-start gap-4 rounded-[24px] border border-[#DCE5DE] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      
      {/* Icon */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF5F0] text-[#176B2C] sm:h-16 sm:w-16">
        {icon}
      </div>

      {/* Isi */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="pr-1 text-base font-bold leading-snug text-[#29313A] sm:text-lg md:text-xl">
            {judul}
          </h2>

          <span className="shrink-0 rounded-full bg-[#FFF4E2] px-3 py-1 text-xs font-semibold text-[#F1B24F] sm:text-sm">
            {badge}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#6D757D] sm:text-base md:text-[17px]">
          {deskripsi}
        </p>
      </div>
    </div>
  );
}

export default KartuFitur;