
import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Built for attention.</h1>
        
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          <p className="text-xl text-slate-500 dark:text-neutral-400 leading-relaxed mb-8 font-medium">
            HookFlow started with a simple observation: creators spend 10 hours filming a masterpiece, 
            only to have it die in the first 3 seconds because of a weak hook.
          </p>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-12 mb-6 uppercase tracking-tight">Our Mission</h2>
          <p className="text-slate-600 dark:text-neutral-400 mb-8 font-medium">
            We believe that great content deserves an audience. In the modern attention economy, 
            the barrier to entry isn't quality—it's curiosity. Our mission is to provide every 
            creator with the psychological tools needed to capture that initial moment of interest.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl transition-colors">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-500 mb-2">10M+</div>
              <div className="text-slate-500 dark:text-neutral-400 font-bold uppercase text-xs tracking-widest">Hooks Generated</div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl transition-colors">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-500 mb-2">50k+</div>
              <div className="text-slate-500 dark:text-neutral-400 font-bold uppercase text-xs tracking-widest">Creators Worldwide</div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-20 mb-6 uppercase tracking-tight">Psychology-First Approach</h2>
          <p className="text-slate-600 dark:text-neutral-400 font-medium">
            Unlike generic AI writers, HookFlow is specifically trained on high-performance content 
            and core psychological triggers like the Curiosity Gap and Loss Aversion. 
            We don't just write text; we design attention.
          </p>
        </div>
      </div>
    </div>
  );
};
