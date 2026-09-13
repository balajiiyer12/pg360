import HeroImage from "../assets/ImageBg.png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Main Hero Section */}
      <main className="grow flex items-center justify-between px-8 md:px-16 py-12">
        {/* left section */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 p-4">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            PG Management System
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            Complete solution at one place. No manual headache, hassle-free operations, and automated tracking.
          </p>
          <button onClick={()=>{navigate("/login")}} className="w-fit mt-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md">
            Get Started
          </button>
        </div>

        {/* right section */}
        <div 
          className="w-full md:w-1/2 h-full min-h-105 item bg-right bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${HeroImage})` }}
        />
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}

export default LandingPage;