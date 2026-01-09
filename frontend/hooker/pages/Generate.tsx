
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { Button } from '../components/Button';
import { HookCard } from '../components/HookCard';
import { LoadingTracker } from '../components/LoadingTracker';
import { PLATFORMS, NICHES, PSYCHOLOGIES, TONES, GOALS } from '../constants';
import { Platform, HookPsychology, Tone, GeneratedHook, HookGoal } from '../types';
import { generateHooks, getUserDashboard } from '../services/geminiService';
import { jsPDF } from "jspdf";
import { PRO_PSYCHOLOGIES } from '../constants';

export const Generate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('Reels');
  const [niche, setNiche] = useState(NICHES[0]);
  const [psychology, setPsychology] = useState<HookPsychology>('Curiosity Gap');
  const [tone, setTone] = useState<Tone>('bold');
  const [goal, setGoal] = useState<HookGoal>('Get Followers');
  const [results, setResults] = useState<GeneratedHook[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const { getToken, userId } = useAuth();
  const [userPlan, setUserPlan] = useState<string>('...');
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);



  React.useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getUserDashboard(token);
          setUserPlan(data.stats.plan || 'free');
        }
      } catch (err) {
        console.error("Failed to fetch plan", err);
      }
    };
    fetchPlan();
  }, [getToken]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        alert("Please sign in to generate hooks");
        setLoading(false);
        return;
      }

      const hooks = await generateHooks({
        platform,
        niche,
        psychology,
        tone,
        topic,
        goal,
        token
      });
      setResults(hooks);
    } catch (error: any) {
      console.error("Failed to generate hooks:", error);
      if (error.message === "INSUFFICIENT_CREDITS") {
        setIsLimitModalOpen(true);
      } else if (error.message.includes("Quota Exceeded")) {
        alert("AI Service is currently busy. Please try again in 60 seconds.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Pro users: Unlimited
    if (userPlan === 'pro') {
      generatePDF();
      return;
    }

    // Free users: 1 per day
    const lastExport = localStorage.getItem('last_pdf_export_date');
    const today = new Date().toISOString().split('T')[0];

    if (lastExport === today) {
      alert("Daily Limit Reached: Free users can only export 1 PDF per day. Upgrade to Pro for unlimited exports.");
      return;
    }

    // Allow and track
    localStorage.setItem('last_pdf_export_date', today);
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`HookFlow Results: ${topic.substring(0, 40)}...`, 10, 20);
    doc.setFontSize(12);

    let y = 30;
    results.forEach((hook, i) => {
      if (y > 270) { doc.addPage(); y = 20; }

      doc.setFont("helvetica", "bold");
      // Clean hook text of emojis if jspdf complains (it often does), but let's try basic
      doc.text(`Variation ${i + 1} (${hook.type}):`, 10, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(hook.hook, 180);
      doc.text(splitText, 10, y);
      y += (splitText.length * 7) + 5;

      doc.setFont("courier", "italic");
      doc.setTextColor(100);
      const splitStrategy = doc.splitTextToSize(`Strategy: ${hook.explanation}`, 180);
      doc.text(splitStrategy, 10, y);
      doc.setTextColor(0);
      y += (splitStrategy.length * 7) + 10;
    });

    doc.save("hookflow-export.pdf");
  };

  const handlePsychologyChange = (val: string) => {
    // Check if Pro
    if (PRO_PSYCHOLOGIES.includes(val as HookPsychology) && userPlan !== 'pro') {
      alert(`"${val}" is a Pro strategy. Upgrade to unlock this powerful trigger.`);
      return;
    }
    setPsychology(val as HookPsychology);
  };

  const toggleSave = (hook: GeneratedHook) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(hook.id)) {
      newSaved.delete(hook.id);
      const existing = JSON.parse(localStorage.getItem('savedHooks') || '[]');
      const filtered = existing.filter((h: any) => h.id !== hook.id);
      localStorage.setItem('savedHooks', JSON.stringify(filtered));
    } else {
      newSaved.add(hook.id);
      const existing = JSON.parse(localStorage.getItem('savedHooks') || '[]');
      localStorage.setItem('savedHooks', JSON.stringify([...existing, hook]));
    }
    setSavedIds(newSaved);
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-black">
      {/* Left Panel: Inputs */}
      <aside
        className={`${isSidebarOpen ? 'w-full lg:w-[450px] opacity-100' : 'w-0 opacity-0 overflow-hidden p-0'
          } border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0D0D0D] lg:p-10 flex flex-col h-full lg:sticky lg:top-20 shadow-xl lg:shadow-none z-10 transition-all duration-300 relative`}
      >
        <div className={`flex items-center space-x-3 mb-10 ${!isSidebarOpen && 'hidden'}`}>
          <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">New Script</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg lg:hidden"
          >
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`space-y-8 flex-grow ${!isSidebarOpen && 'hidden'}`}>
          <div className="group">
            <label className="block text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3 group-focus-within:text-indigo-500 transition-colors">What is your video about?</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: How to build a SaaS in 30 days using AI tools..."
              className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none h-40 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Psychology</label>
              <select
                value={psychology}
                onChange={(e) => handlePsychologyChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                {PSYCHOLOGIES.map(p => (
                  <option key={p} value={p}>
                    {p} {PRO_PSYCHOLOGIES.includes(p) ? '🔒 (Pro)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Niche</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Conversion Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as HookGoal)}
              className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className={`mt-12 ${!isSidebarOpen && 'hidden'}`}>
          <Button
            onClick={handleGenerate}
            isLoading={loading}
            className="w-full h-18 rounded-3xl text-xl font-black py-6 shadow-2xl shadow-indigo-600/30"
            disabled={!topic.trim()}
          >
            Generate Viral Hooks
          </Button>
          <div className="flex items-center justify-center mt-6 space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-slate-200 dark:bg-neutral-800 border-2 border-white dark:border-black"></div>)}
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-[0.2em]">Live: 43 creators generating</p>
          </div>
        </div>

        {/* Sidebar Toggle Button (Inside Sidebar when open) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-[#111] border border-slate-200 dark:border-gray-800 rounded-full p-1 shadow-md hover:scale-110 transition-transform z-50 hidden lg:block"
        >
          <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Floating Toggle Button (When sidebar closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:fixed left-6 top-24 bg-white dark:bg-[#111] border border-slate-200 dark:border-gray-800 p-3 rounded-xl shadow-xl hover:scale-105 transition-all z-20 group"
        >
          <svg className="w-6 h-6 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Open Controls
          </div>
        </button>
      )}

      {/* Right Panel: Results */}
      <main className="flex-grow p-6 lg:p-16 overflow-y-auto bg-slate-50 dark:bg-black/80">
        {!results.length && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-white dark:bg-[#111] border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-[2.5rem] mb-10 flex items-center justify-center shadow-xl rotate-3">
              <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Your virality starts here.</h3>
            <p className="text-slate-500 dark:text-neutral-400 text-lg font-medium">Input your topic on the left and our AI will engineer hooks that command attention.</p>
          </div>
        )}

        {loading && (
          <div className="flex h-full items-center justify-center animate-in fade-in duration-300">
            <LoadingTracker />
          </div>
        )}

        {results.length > 0 && !loading && (
          <div className="space-y-10 max-w-6xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Success Engine</h3>
                <p className="text-slate-500 dark:text-neutral-500 font-medium">10 variations generated for "{topic.substring(0, 30)}..."</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 border-slate-200 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white"
                >
                  {userPlan === 'pro' ? 'Export PDF' : 'Export PDF (1/day)'}
                </Button>
                <Button
                  onClick={() => {
                    const allHooks = results.map(h => `${h.text}\n\n${h.explanation}`).join('\n---\n');
                    navigator.clipboard.writeText(allHooks);
                    alert("All hooks copied to clipboard!");
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 border-slate-200 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white"
                >
                  Copy All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {results.map((hook, index) => (
                <div key={hook.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards">
                  <HookCard
                    hook={hook}
                    isSaved={savedIds.has(hook.id)}
                    onSave={toggleSave}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {/* Limit Reached Modal */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/10 rounded-[3rem] max-w-lg w-full p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Limit Reached</h2>
            <p className="text-slate-500 dark:text-neutral-400 text-lg font-medium mb-10 leading-relaxed">
              You've exhausted your daily generation credits. Upgrade to HookFlow Pro for unlimited access and elite psychology strategies.
            </p>
            <div className="flex flex-col space-y-4">
              <Link to="/pricing">
                <Button className="w-full h-16 rounded-2xl text-lg font-black shadow-lg shadow-indigo-500/20">Upgrade to Pro</Button>
              </Link>
              <button
                onClick={() => setIsLimitModalOpen(false)}
                className="text-slate-400 dark:text-neutral-500 font-bold hover:text-slate-600 dark:hover:text-neutral-300 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
