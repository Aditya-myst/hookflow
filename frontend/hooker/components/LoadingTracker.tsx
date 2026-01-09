import React, { useState, useEffect } from 'react';

const STEPS = [
    "Analyzing topic and context...",
    "Identifying viral patterns...",
    "Scanning hook database...",
    "Applying psychology triggers...",
    "Synthesizing variations...",
    "Polishing captions..."
];

export const LoadingTracker: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < STEPS.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800); // Move to next step every 800ms
            return () => clearTimeout(timeout);
        }
    }, [currentStep]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto p-8">
            <div className="w-16 h-16 mb-8 relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/30">
                    <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>

            <div className="movie-loading-text w-full space-y-4">
                {STEPS.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center space-x-3 transition-all duration-500 ${index <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'
                            }`}
                    >
                        <div className={`
              w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500
              ${index < currentStep
                                ? 'bg-green-500 border-green-500'
                                : index === currentStep
                                    ? 'border-indigo-500 text-indigo-500'
                                    : 'border-slate-300 dark:border-neutral-700'}
            `}>
                            {index < currentStep && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {index === currentStep && (
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <span className={`
              font-bold text-sm tracking-wide
              ${index <= currentStep ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-neutral-600'}
            `}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
