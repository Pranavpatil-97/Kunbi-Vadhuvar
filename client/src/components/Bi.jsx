import { useLanguage } from "../context/LanguageContext";

const Bi = ({ mr, en, className = "", p = "", s = "" }) => {
  const { lang } = useLanguage();
  const first = lang === "mr" ? mr : en;
  const second = lang === "mr" ? en : mr;
  return (
    <span className={`block ${className}`}>
      <span className={`block ${p}`}>{first}</span>
      <span className={`block ${s}`}>{second}</span>
    </span>
  );
};

export default Bi;