
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "@clerk/clerk-react";
import { verifyPayment } from '../services/payService';
import { useNavigate } from 'react-router-dom';

export const Pricing: React.FC = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <div className="text-center mb-24">
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Invest in your <br /> <span className="text-indigo-600">Growth.</span></h1>
        <p className="text-slate-500 dark:text-neutral-400 text-2xl font-bold max-w-2xl mx-auto">One viral post pays for a lifetime subscription. Choose your weapon.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto px-4">
        {/* Free Plan */}
        <div className="bg-slate-50 dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-[3.5rem] p-12 flex flex-col hover:border-indigo-500/30 transition-all group">
          <div className="mb-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Free Tier</h3>
            <p className="text-slate-500 dark:text-neutral-500 font-semibold">Perfect for casual experimenters.</p>
            <div className="mt-10 flex items-baseline">
              <span className="text-6xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-400 font-bold ml-4">/ Month</span>
            </div>
          </div>

          <ul className="space-y-6 mb-12 flex-grow">
            {['3 AI hooks per day', '1 PDF Export per day', '3 psychology triggers', 'Basic platforms', 'Standard generation speed'].map(feature => (
              <li key={feature} className="flex items-center text-slate-600 dark:text-neutral-400 font-bold">
                <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mr-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-slate-200 dark:border-transparent">
                  <svg className="w-3 h-3 currentcolor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <Link to="/generate" className="w-full">
            <Button variant="outline" className="w-full py-6 rounded-2xl border-slate-200 dark:border-neutral-800 text-lg font-black text-slate-900 dark:text-white">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-indigo-50 dark:bg-indigo-600/5 border-4 border-indigo-600 rounded-[3.5rem] p-12 flex flex-col relative scale-105 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)] transition-transform hover:scale-[1.07]">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-black px-6 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-xl">
            Ultimate Choice
          </div>
          <div className="mb-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Creator Pro</h3>
            <p className="text-slate-500 dark:text-indigo-600 dark:text-indigo-200/50 font-semibold">For the top 1% of content creators.</p>
            <div className="mt-10 flex items-baseline">
              <span className="text-6xl font-black text-slate-900 dark:text-white">$9</span>
              <span className="text-slate-500 dark:text-indigo-300 font-bold ml-4">/ Month</span>
            </div>
          </div>

          <ul className="space-y-6 mb-12 flex-grow">
            {[
              'Unlimited viral generations',
              'Unlock all 8 psychology engines',
              'Advanced platform formatting',
              'Bulk CSV/PDF Exporting',
              'Priority AI processing',
              'Personalized growth insights'
            ].map(feature => (
              <li key={feature} className="flex items-center text-slate-900 dark:text-white font-bold">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-600/30">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <div className="w-full">
            <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test" }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", borderRadius: 12 }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: "9.00",
                          currency_code: "USD"
                        },
                        description: "HookFlow Pro Subscription"
                      }
                    ]
                  });
                }}
                onApprove={async (data, actions) => {
                  if (!actions.order) return;
                  const order = await actions.order.capture();
                  // Verify with backend
                  try {
                    const token = await getToken();
                    if (token) {
                      await verifyPayment(order.id, token);
                      alert("Upgrade Successful! You are now a Pro member.");
                      navigate('/dashboard');
                    }
                  } catch (err: any) {
                    alert("Payment verification failed: " + err.message);
                  }
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>

      <p className="text-center mt-20 text-slate-400 dark:text-neutral-600 font-bold text-sm uppercase tracking-widest">No long term commitment &bull; Cancel any time</p>
    </div>
  );
};
