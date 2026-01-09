import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, RedirectToSignUp, useAuth } from "@clerk/clerk-react";
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Generate } from './pages/Generate';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { Pricing } from './pages/Pricing';
import { Examples } from './pages/Examples';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A0A0A] py-24 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">H</div>
            <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter">HookFlow</span>
          </div>
          <p className="text-slate-500 dark:text-neutral-500 text-lg max-w-sm font-medium leading-relaxed">
            Revolutionizing creator growth through psychological triggers and AI precision. Stop guessing, start winning.
          </p>
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-8">Platform</h4>
          <ul className="space-y-4 text-slate-500 dark:text-neutral-500 font-bold">
            <li><Link to="/generate" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Hook Generator</Link></li>
            <li><Link to="/captions" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Caption AI</Link></li>
            <li><Link to="/examples" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Library</Link></li>
            <li><Link to="/pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pro Plans</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-8">Support</h4>
          <ul className="space-y-4 text-slate-500 dark:text-neutral-500 font-bold">
            <li><Link to="/about" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About Us</Link></li>
            <li><a href="mailto:hello@hookflow.ai" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Contact</a></li>
            <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-white transition-colors">My Studio</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-100 dark:border-white/5">
        <div className="text-sm font-bold text-slate-400 dark:text-neutral-600 tracking-widest uppercase mb-6 md:mb-0">
          &copy; {new Date().getFullYear()} HookFlow AI &bull; Built for the Creator Economy
        </div>
        <div className="flex space-x-8">
          <a href="#" className="text-slate-400 dark:text-neutral-600 hover:text-indigo-600 dark:hover:text-white transition-all transform hover:-translate-y-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-500 bg-slate-50 dark:bg-black">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route
              path="/generate"
              element={
                <>
                  <SignedIn>
                    <Generate />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignUp />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/captions"
              element={
                <>
                  <SignedIn>
                    <CaptionGenerator />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignUp />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
