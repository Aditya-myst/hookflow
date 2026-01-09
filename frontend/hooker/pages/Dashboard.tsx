
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { GeneratedHook, UserDashboardData } from '../types';
import { HookCard } from '../components/HookCard';
import { Button } from '../components/Button';
import { API_BASE_URL } from '../config';

export const Dashboard: React.FC = () => {
  const [savedHooks, setSavedHooks] = useState<GeneratedHook[]>([]);
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    // Load local saved hooks
    const saved = JSON.parse(localStorage.getItem('savedHooks') || '[]');
    setSavedHooks(saved);

    // Fetch real user data
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const clearSaves = () => {
    if (window.confirm("Are you sure you want to clear all saved hooks?")) {
      localStorage.setItem('savedHooks', '[]');
      setSavedHooks([]);
    }
  };

  const toggleSave = (hook: GeneratedHook) => {
    // For dashboard, we only expect un-saving (removing), but let's keep it generic or check
    const newSaved = savedHooks.filter(h => h.id !== hook.id);
    setSavedHooks(newSaved);
    localStorage.setItem('savedHooks', JSON.stringify(newSaved));
  };

  const planName = dashboardData?.stats?.plan || 'Free';
  const credits = dashboardData?.stats?.credits ?? '...'; // Avoid defaulting to 5
  const isFree = planName.toLowerCase() === 'free';

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">Your Studio</h1>
          <p className="text-slate-500 dark:text-neutral-400 text-2xl font-semibold">The workspace for high-performance creators.</p>
        </div>
        <div className="flex space-x-5">
          <Button variant="outline" className="px-8 h-16 rounded-[1.5rem] font-bold" onClick={clearSaves}>Clear History</Button>
          <Link to="/generate">
            <Button className="px-10 h-16 rounded-[1.5rem] font-black text-lg">New Project</Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { label: 'Saved Hooks', value: savedHooks.length, color: 'indigo' },
          { label: 'Credits Left', value: loading ? '...' : credits, color: 'slate' }, // Show real credits
          { label: 'Current Plan', value: loading ? '...' : planName.toUpperCase(), color: 'green' } // Show real plan
        ].map((stat, i) => (
          <div key={i} className="p-10 bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-sm hover:border-indigo-500/20 transition-all">
            <p className="text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.4em] mb-4">{stat.label}</p>
            <p className={`text-5xl font-black text-slate-900 dark:text-white tracking-tight`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-white/5 pt-16">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Saved Library</h3>
          <span className="text-sm font-bold text-indigo-500 bg-indigo-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest">{savedHooks.length} Items</span>
        </div>

        {savedHooks.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-white/2 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-neutral-800">
            <div className="w-20 h-20 bg-white dark:bg-neutral-900 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-neutral-500 text-2xl font-bold mb-10 max-w-sm mx-auto">Your creative library is empty. Let's build something.</p>
            <Link to="/generate">
              <Button size="lg" className="rounded-2xl px-12">Generate Hooks Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedHooks.map((hook) => (
              <HookCard
                key={hook.id}
                hook={hook}
                isSaved={true}
                onSave={() => toggleSave(hook)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
