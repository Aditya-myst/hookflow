
import React from 'react';

const EXAMPLES = [
  {
    niche: 'Fitness',
    platform: 'Instagram Reels',
    before: 'I will show you how to do a bicep curl.',
    after: 'Stop curling like a beginner and start doing this instead.',
    why: 'Uses "Pattern Interrupt" and "Authority" to highlight a common mistake.'
  },
  {
    niche: 'Business',
    platform: 'LinkedIn',
    before: 'I made $10k this month selling software.',
    after: 'How I built a $10k/mo business while working a 9-5 (without burnout).',
    why: 'Uses "Relatability" and "Curiosity Gap" by addressing a specific pain point.'
  },
  {
    niche: 'Tech',
    platform: 'TikTok',
    before: 'Here is a cool AI website you should try.',
    after: 'This secret AI tool feels illegal to know.',
    why: 'Uses "Loss Aversion" (scarcity) and intense "Curiosity Gap".'
  }
];

export const Examples: React.FC = () => {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Learn from the best.</h1>
        <p className="text-slate-500 dark:text-neutral-400 text-lg">See how we transform boring sentences into viral hooks using psychological triggers.</p>
      </div>

      <div className="space-y-12">
        {EXAMPLES.map((ex, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white dark:bg-neutral-900/30 border border-slate-200 dark:border-neutral-800 rounded-[32px] p-8 md:p-12 hover:border-indigo-500/30 dark:hover:border-neutral-700 transition-all shadow-sm">
            <div>
              <div className="flex space-x-2 mb-6">
                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-500/20">{ex.niche}</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded">{ex.platform}</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase mb-2">The Old Way</label>
                  <div className="p-4 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-500 dark:text-neutral-500 italic line-through opacity-50">
                    "{ex.before}"
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-500 uppercase mb-2">The HookFlow Way</label>
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/30 rounded-2xl text-white text-xl font-bold leading-tight">
                    "{ex.after}"
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-12 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-neutral-800 pt-8 lg:pt-0">
              <h4 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center">
                <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">?</span>
                Why it works
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed mb-8">
                {ex.why} By reframing the content around a specific emotion or mystery, we increase the CTR (Click-Through Rate) by over 300%.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-neutral-500">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                  Increases scroll-stop rate
                </li>
                <li className="flex items-center text-sm text-neutral-500">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                  Builds immediate authority
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
