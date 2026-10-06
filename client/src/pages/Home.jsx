import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicProfiles } from "../api/public";
import { useAuth } from "../context/AuthContext";
import Bi from "../components/Bi";
import Logo from "../components/Logo";
import LanguageToggle from "../components/LanguageToggle";
import heroImage from "../assets/hero-couple.jpg";

const steps = [
  {
    n: 1,
    mr: "नोंदणी करा",
    en: "Register",
    dmr: "तुमची माहिती सुरक्षितपणे भरा.",
    den: "Fill in your details securely.",
  },
  {
    n: 2,
    mr: "प्रशासक पडताळणी",
    en: "Admin verifies",
    dmr: "आमची टीम तुमचे प्रोफाइल तपासते.",
    den: "Our team reviews your profile.",
  },
  {
    n: 3,
    mr: "तुमच्या संमतीने शेअर",
    en: "Shared with permission",
    dmr: "तुमच्या परवानगीनेच प्रोफाइल दाखवले जाते.",
    den: "Your profile is shown only with your consent.",
  },
];

const Home = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProfiles()
      .then((data) => setProfiles(data.profiles))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ctaTo = user ? "/dashboard" : "/register";

  return (
    <div className="min-h-screen bg-blush text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-black/10 bg-blush/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />

          <div className="hidden items-center gap-10 md:flex">
            <a href="#how-it-works" className="text-sm hover:text-primary">
              <Bi mr="कसे काम करते" en="How it works" p="font-medium" s="text-xs text-gray-600" />
            </a>
            <a href="#privacy" className="text-sm hover:text-primary">
              <Bi mr="गोपनीयता" en="Privacy" p="font-medium" s="text-xs text-gray-600" />
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-primary px-4 py-2 text-center text-sm text-white hover:opacity-90"
              >
                <Bi mr="डॅशबोर्ड" en="Dashboard" p="font-semibold" s="text-xs opacity-90" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-lg border border-primary/20 bg-white px-4 py-2 text-center text-sm text-primary hover:bg-primary/5 sm:block"
                >
                  <Bi mr="लॉगिन" en="Login" p="font-semibold" s="text-xs" />
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-center text-sm text-white hover:opacity-90"
                >
                  <Bi mr="नोंदणी करा" en="Register" p="font-semibold" s="text-xs opacity-90" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F2A900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15z" />
              <path d="M5 19c3-5 6-8 10-10" />
            </svg>
            <Bi
              mr="महाराष्ट्रातील कुणबी समाजासाठी"
              en="For the Kunbi community of Maharashtra"
              p="text-sm font-semibold text-primary"
              s="text-xs text-primary"
            />
          </div>

          <h1 className="text-4xl font-bold leading-[1.4] text-primary sm:text-5xl">
            आपल्या समाजातील योग्य जोडीदार शोधा
          </h1>
          <p className="mt-4 text-2xl font-medium text-primary sm:text-3xl">
            Find the right life partner within our community
          </p>

          <div className="mt-8 max-w-xl space-y-1 text-gray-600">
            <p>
              कुणबी (मराठा-कुणबी) समाजातील विवाहपरिचयासाठी एक साधी, आदरपूर्ण सुरुवात. तुमची माहिती, तुमची संमती.
            </p>
            <p className="text-sm">
              A thoughtful space for matrimonial introductions within the Kunbi (Maratha-Kunbi)
              community. Your details. Your permission.
            </p>
          </div>

          <Link
            to={ctaTo}
            className="mt-8 block w-full max-w-sm rounded-lg bg-primary px-6 py-3.5 text-center text-white hover:opacity-90"
          >
            {user ? (
              <Bi mr="डॅशबोर्डवर जा" en="Go to Dashboard" p="font-semibold" s="text-sm" />
            ) : (
              <Bi mr="नोंदणी करा" en="Register your profile" p="font-semibold" s="text-sm" />
            )}
          </Link>

          {!user && (
            <div className="mt-3 text-xs text-gray-500">
              <Bi
                mr="प्रथम नोंदणी, नंतर प्रशासक पडताळणी"
                en="Register first. Admin verification follows."
              />
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-[28px] shadow-lg">
          <img
            src={heroImage}
            alt=""
            className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[530px]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 text-white">
            <div className="mb-3 h-1 w-10 bg-gold" />
            <p className="text-lg font-semibold">मनं जुळण्याची नवी सुरुवात</p>
            <p className="text-sm">A new beginning, rooted in belonging</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-white/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-primary">
            <Bi mr="कसे काम करते" en="How it works" s="text-base font-medium text-gray-600" />
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  <Bi mr={s.mr} en={s.en} s="text-sm font-normal text-gray-500" />
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <Bi mr={s.dmr} en={s.den} s="text-xs text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#F5EEE3] p-6 sm:flex-row sm:items-center sm:p-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7A1F2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <p className="text-lg font-semibold text-primary">
              तुमची माहिती फक्त तुमच्या परवानगीनेच इतरांना दाखवली जाते.
            </p>
            <p className="text-sm text-gray-600">
              Your details are shown to others only with your permission.
            </p>
          </div>
        </div>
      </section>

      {/* Recently joined (existing feature, preserved) */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="mb-1 text-2xl font-bold text-gray-800">
          <Bi mr="नुकतेच सामील झालेले" en="Recently Joined" s="text-base font-medium text-gray-500" />
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Login or register to view full profiles and connect.
        </p>

        {loading && <p className="text-gray-500">Loading...</p>}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((p) => (
            <div key={p.id} className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-gold/10 text-2xl">
                {p.gender === "female" ? "👰" : "🤵"}
              </div>
              <h3 className="font-semibold text-gray-800">
                {p.firstName} <span className="select-none blur-sm">Xxxxx</span>
              </h3>
              <p className="text-xs text-gray-500">
                {p.age} yrs • {p.city}
              </p>
              <p className="text-xs text-gray-500">{p.occupation}</p>
              <Link
                to="/register"
                className="mt-3 block rounded-lg border border-primary py-1.5 text-center text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                Login to View
              </Link>
            </div>
          ))}
        </div>

        {!loading && profiles.length === 0 && (
          <p className="text-sm text-gray-500">No profiles yet — be the first to join!</p>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gold/20 bg-white py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold text-primary">
          <Bi mr="तुमचा जोडीदार शोधायला तयार?" en="Ready to find your match?" s="text-base font-medium text-gray-500" />
        </h2>
        <Link
          to={ctaTo}
          className="mt-4 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {user ? "Go to Dashboard" : "नोंदणी करा • Register Now"}
        </Link>
      </section>

      <footer className="bg-blush py-6 text-center text-xs text-gray-500">
        © कुणबी वधूवर • Kunbi Vadhuvar
      </footer>
    </div>
  );
};

export default Home;