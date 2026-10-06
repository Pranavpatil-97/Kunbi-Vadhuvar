import { useRef } from "react";

const OtpInput = ({ value, onChange, length = 6, disabled = false }) => {
  const refs = useRef([]);

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    onChange(value.slice(0, i) + ch + value.slice(i + 1));
    if (ch && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          className="h-12 w-full rounded-xl border border-primary/15 bg-blush text-center text-lg font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      ))}
    </div>
  );
};

export default OtpInput;