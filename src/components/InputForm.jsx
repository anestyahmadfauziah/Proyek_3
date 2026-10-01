import { Eye, EyeOff } from "lucide-react";

function InputForm({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
  showPassword = false,
  onTogglePassword,
}) {
  const inputType =
    type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <label className="mb-2 block text-base font-bold text-[#38414A] sm:text-lg">
        {label}
      </label>

      <div className="relative">
        {/* Icon */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#68747D]">
          {icon}
        </div>

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-[72px] w-full rounded-[17px] border border-transparent bg-[#E4F0E6] pl-16 pr-14 text-base text-[#38414A] outline-none transition-all placeholder:text-[#7B858D] focus:border-[#A8CDAF] focus:bg-[#EDF7EE] focus:ring-2 focus:ring-[#CBE4CE] sm:text-lg"
        />

        {/* Tombol password */}
        {type === "password" && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#68747D] transition hover:text-[#176B2C]"
            aria-label={
              showPassword
                ? "Sembunyikan kata sandi"
                : "Tampilkan kata sandi"
            }
          >
            {showPassword ? (
              <EyeOff size={24} strokeWidth={1.8} />
            ) : (
              <Eye size={24} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputForm;