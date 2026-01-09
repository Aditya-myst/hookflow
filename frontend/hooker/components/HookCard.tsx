
import React, { useState } from 'react';
import { GeneratedHook } from '../types';

interface HookCardProps {
  hook: GeneratedHook;
  onSave?: (hook: GeneratedHook) => void;
  isSaved?: boolean;
}

export const HookCard: React.FC<HookCardProps> = ({ hook, onSave, isSaved }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-[2rem] p-8 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.1)] hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-2.5">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">
            {hook.type}
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            {hook.platform}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onSave?.(hook)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${isSaved ? 'text-indigo-500 bg-indigo-500/10 scale-110' : 'text-slate-400 dark:text-neutral-500 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'}`}
            title={isSaved ? "Remove from saves" : "Save hook"}
          >
            <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <svg className="absolute -top-4 -left-4 w-10 h-10 text-slate-100 dark:text-white/5 -z-10" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm12-12c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"></path></svg>
        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed tracking-tight">
          "{hook.text}"
        </p>
      </div>

      {hook.explanation && (
        <div className="bg-slate-50 dark:bg-black/40 rounded-2xl p-4 mb-8 border border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-500 dark:text-neutral-500 font-medium leading-relaxed">
            <span className="font-bold text-indigo-500 dark:text-indigo-400 mr-2 uppercase text-[10px] tracking-widest">Why it works:</span>
            {hook.explanation}
          </p>
        </div>
      )}

      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${copied ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 shadow-xl dark:shadow-none'}`}
      >
        {copied ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="uppercase tracking-[0.1em]">Copied to clipboard</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span className="uppercase tracking-[0.1em]">Copy Viral Hook</span>
          </>
        )}
      </button>
    </div>
  );
};
