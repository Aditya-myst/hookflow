import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-black">
            {/* Left Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 relative">
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black">H</span>
                        </div>
                        <span className="font-black dark:text-white">HookFlow</span>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-slate-500 dark:text-neutral-500 font-bold">Start your journey to viral growth today.</p>
                    </div>

                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none border-none p-0 w-full",
                                header: "hidden", // We use our own header
                                navbar: "hidden",
                                main: "w-full",
                                footer: "mt-4",
                                socialButtonsBlockButton: "w-full py-3.5 border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-neutral-300 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all mb-4",
                                dividerRow: "my-6",
                                dividerText: "text-slate-400 dark:text-neutral-600 text-[10px] font-black uppercase tracking-widest",
                                formFieldLabel: "text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-2",
                                formFieldInput: "bg-white dark:bg-neutral-900 border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold",
                                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all",
                                footerActionText: "text-slate-500 dark:text-neutral-500 font-bold",
                                footerActionLink: "text-indigo-600 hover:text-indigo-500 font-black transition-colors"
                            }
                        }}
                    />
                </div>
            </div>

            {/* Right Side: Visual/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-700 to-indigo-900"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 mb-10 shadow-2xl">
                        <span className="text-white text-4xl font-black">H</span>
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
                        Engineered for <span className="text-indigo-200 text-6xl block mt-2">Retention.</span>
                    </h2>
                    <p className="text-indigo-100 text-xl font-medium leading-relaxed mb-12">
                        Join 5,000+ creators who use HookFlow to stop the scroll and own the feed.
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5">
                            <p className="text-white font-black text-xs uppercase tracking-widest mb-2">Psychology</p>
                            <p className="text-indigo-100 text-sm font-bold">8+ Elite Engines</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5">
                            <p className="text-white font-black text-xs uppercase tracking-widest mb-2">Automation</p>
                            <p className="text-indigo-100 text-sm font-bold">Caption Generation</p>
                        </div>
                    </div>
                </div>

                {/* Background Text */}
                <div className="absolute top-10 right-10 text-white/10 text-9xl font-black select-none pointer-events-none">
                    ENGINE
                </div>
            </div>
        </div>
    );
}
