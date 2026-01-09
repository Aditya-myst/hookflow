
import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { NavLink, Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled
      ? 'py-3 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5'
      : 'py-6 bg-transparent'
      }`}>
      <div className="w-full px-6 md:px-12">
        <div className="flex justify-between items-center">
          {/* Logo - Top Left Corner (relative to wide padding) */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-500">
                <span className="text-white font-black text-lg">H</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">HookFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered Pill */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-slate-200/50 dark:bg-white/5 p-1 rounded-2xl border border-slate-300/50 dark:border-white/10 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200
                  ${isActive
                    ? 'text-slate-900 dark:text-white bg-white dark:bg-white/10 shadow-sm'
                    : 'text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Actions - Top Right Corner */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <SignedOut>
              <Link
                to="/sign-up"
                className="px-6 py-2.5 text-slate-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white font-bold text-sm transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/sign-in"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 rounded-xl"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-neutral-800"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`
        lg:hidden fixed inset-x-0 top-[72px] bg-white dark:bg-black border-b border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out z-[99] overflow-hidden
        ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 py-12 space-y-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                block py-4 px-6 rounded-2xl text-xl font-black transition-all
                ${isActive
                  ? 'text-indigo-600 dark:text-white bg-indigo-50 dark:bg-white/5'
                  : 'text-slate-600 dark:text-neutral-400'}
              `}
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-6">
            <SignedOut>
              <Link
                to="/sign-in"
                className="block bg-indigo-600 text-white text-center py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/30"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
