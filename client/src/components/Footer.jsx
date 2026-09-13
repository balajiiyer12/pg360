import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-6 md:px-16">
      <div className="flex flex-col md:flex-row items-center justify-evenly gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">PG360</span>
          <span>• Streamlining hostelling & living spaces</span>
        </div>

        <div className="text-slate-600">
          Developed By <span className="font-semibold text-slate-900">Balaji Iyer</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;