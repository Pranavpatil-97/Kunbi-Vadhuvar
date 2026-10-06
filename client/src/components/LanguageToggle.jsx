import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  const base = "px-2 text-xs transition";
  return (
    <div className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-2 py-1.5">
      <button
        type="button"
        onClick={() => setLang("mr")}
        className={`${base} ${lang === "mr" ? "font-bold text-primary" : "text-gray-500"}`}
      >
        मराठी
      </button>
      <span className="text-gray-300">|</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? "font-bold text-primary" : "text-gray-500"}`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageToggle;