export default function FilterDropdown({
  label,
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input !py-2.5 !text-sm min-w-[150px]"
        aria-label={label}
      >
        <option value="">{label}: All</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}
