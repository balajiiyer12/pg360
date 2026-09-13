import HeroImage from "../assets/ImageBg.png";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-6 py-4 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-extrabold text-sm">
            360
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PG<span className="text-slate-500">360</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
            Login
          </button>
          <button className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="grow flex items-center justify-between px-8 md:px-16 py-12">
        {/* left section */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 p-4">
          <span className="w-fit px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-200/60 rounded-full">
            Smart Management
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            PG Management System
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            Complete solution at one place. No manual headache, hassle-free operations, and automated tracking.
          </p>
          <button className="w-fit mt-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md">
            Get Started
          </button>
        </div>

        {/* right section */}
        <div 
          className="w-full md:w-1/2 h-full min-h-[420px] bg-right bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${HeroImage})` }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-6 md:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">PG360</span>
            <span>• Streamlining hostelling & living spaces</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-600">
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#support" className="hover:text-slate-900 transition-colors">Support</a>
          </div>

          <div className="text-slate-600">
            Developed By <span className="font-semibold text-slate-900">Balaji Iyer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;