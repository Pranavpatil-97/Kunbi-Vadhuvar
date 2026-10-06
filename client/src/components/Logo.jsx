import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2A900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15z" />
        <path d="M5 19c3-5 6-8 10-10" />
      </svg>
    </span>
    <span className="text-2xl font-bold text-primary">कुणबी वधूवर</span>
  </Link>
);

export default Logo;