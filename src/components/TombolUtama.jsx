function TombolUtama({
  children,
  onClick,
  variant = "primary",
  icon,
}) {
  const style =
    variant === "primary"
      ? "bg-[#176B2C] text-white hover:bg-[#125923] shadow-[0_2px_3px_rgba(0,0,0,0.15)]"
      : "bg-[#E6F4E8] text-[#176B2C] hover:bg-[#D9EEDC]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[18px] px-5 text-base font-bold transition-all duration-200 active:scale-[0.99] sm:min-h-[56px] sm:text-lg ${style}`}
    >
      {icon && icon}
      <span>{children}</span>
    </button>
  );
}

export default TombolUtama;