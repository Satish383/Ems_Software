import { initials, avatarColor } from "@/utils/format";

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({
  name = "",
  src,
  size = "md",
  className = "",
}) {
  const s = sizeMap[size] || sizeMap.md;
  return (
    <div
      className={`${s} ${avatarColor(name)} rounded-full text-white font-semibold flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
