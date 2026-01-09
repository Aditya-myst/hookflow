
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { TESTIMONIALS } from '../constants';

export const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 overflow-x-hidden">
      {/* Background Enhancements */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[180px] rounded-full -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full mb-12 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-500 dark:text-neutral-300 tracking-[0.3em] uppercase">The future of content creation is here</span>
        </div>

        <h1 className="text-6xl md:text-[8.5rem] font-black text-slate-900 dark:text-white tracking-tighter mb-10 leading-[0.85] animate-in fade-in zoom-in-95 duration-1000">
          Master the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600">First 3 Seconds.</span>
        </h1>

        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 dark:text-neutral-400 mb-16 leading-relaxed font-semibold animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          AI-engineered hooks for Reels, TikTok, and LinkedIn. <br className="hidden md:block" />
          Backed by psychology, designed for extreme growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link to="/generate">
            <Button size="lg" className="px-12 h-20 rounded-[2rem] text-xl font-black shadow-[0_20px_60px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all">
              Generate Free Hooks
              <svg className="w-6 h-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
          <Link to="/examples">
            <Button variant="outline" size="lg" className="px-12 h-20 rounded-[2rem] text-xl font-black border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 shadow-xl hover:scale-105 active:scale-95 transition-all text-slate-900 dark:text-white">
              Success Gallery
            </Button>
          </Link>
        </div>

        {/* Floating Preview Card */}
        <div className="mt-40 relative max-w-5xl mx-auto group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl overflow-hidden transition-all duration-500 group-hover:border-indigo-500/30">
            <div className="flex items-center space-x-3 mb-12">
              <div className="flex space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-400/20 border border-red-400/50"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400/20 border border-yellow-400/50"></div>
                <div className="w-4 h-4 rounded-full bg-green-400/20 border border-green-400/50"></div>
              </div>
              <div className="h-px flex-grow bg-slate-100 dark:bg-white/5"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-neutral-500">HookFlow Studio</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
              <div className="space-y-6 relative">
                {/* Mock Input Interface */}
                <div className="group relative z-10 bg-white dark:bg-[#0A0A0A] p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">New Script</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mb-2 uppercase tracking-wider">Topic</div>
                      <div className="h-10 w-full bg-slate-50 dark:bg-white/5 rounded-xl flex items-center px-4">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">How to use AI for content scaling...</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mb-2 uppercase tracking-wider">Platform</div>
                        <div className="h-10 w-full bg-slate-50 dark:bg-white/5 rounded-xl flex items-center px-3 space-x-2">
                          <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Instagram</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mb-2 uppercase tracking-wider">Mood</div>
                        <div className="h-10 w-full bg-indigo-600/5 border border-indigo-600/20 rounded-xl flex items-center px-3 justify-between">
                          <span className="text-xs font-bold text-indigo-600">Controversial</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <span className="text-white text-xs font-black uppercase tracking-widest">Generate Magic</span>
                    </div>
                  </div>
                </div>

                {/* Decorative blobs behind */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
              </div>
              <div className="space-y-6">
                <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 transform -rotate-1 group-hover:rotate-0 transition-transform duration-700">
                  <p className="text-slate-900 dark:text-white font-black text-2xl mb-4 leading-tight">"This hidden Chrome extension feels illegal to know..."</p>
                  <span className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">Curiosity Gap Engine</span>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-transparent opacity-50 dark:opacity-30 blur-[0.5px]">
                  <p className="text-slate-500 dark:text-neutral-400 font-bold italic text-xl">"How I scaled my agency to $50k/mo in 6 months..."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-50 dark:bg-black py-40 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-[0.6em] mb-24">Trusted by the top 1% of content creators</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="relative group p-12 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500 hover:-translate-y-2">
                <p className="text-slate-600 dark:text-neutral-400 mb-12 italic text-xl leading-relaxed font-medium">"{t.content}"</p>
                <div className="flex items-center space-x-5">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full ring-4 ring-indigo-500/10 shadow-lg" />
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg">{t.name}</h4>
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
