import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";
import Bi from "./Bi";
import heroImage from "../assets/hero-couple.jpg";

const AuthLayout = ({ title, children }) => (
  <div className="min-h-screen bg-blush">
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <LanguageToggle />
      </div>
    </header>

    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14">
      {/* Left: trust message (hidden on small screens to keep the form first) */}
      <div className="hidden lg:block">
        <h1 className="text-4xl font-bold leading-[1.4] text-primary">
          नात्याची सुरुवात विश्वासाने.
        </h1>
        <p className="mt-2 text-2xl font-medium text-primary">
          Every meaningful connection starts with trust.
        </p>
        <img
          src={heroImage}
          alt=""
          className="mt-8 h-[360px] w-full rounded-[28px] object-cover shadow-lg"
        />
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#F5EEE3] p-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7A1F2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <p className="text-sm font-medium">
              तुमची माहिती फक्त तुमच्या परवानगीनेच इतरांना दाखवली जाते.
            </p>
            <p className="text-xs text-gray-600">
              Your details are shown to others only with your permission.
            </p>
          </div>
        </div>
      </div>

      {/* Right: form card */}
      <div className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-3xl font-bold text-gray-800">
          <Bi mr={title.mr} en={title.en} s="text-lg font-medium" />
        </h2>
        {children}
      </div>
    </main>
  </div>
);

export default AuthLayout;