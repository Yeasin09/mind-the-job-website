import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ChevronRight, Linkedin } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Auth = () => {
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
        role: 'candidate'
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (view === 'forgot') {
            alert("Password Reset Link Sent to your email! (Mock)");
            setView('login');
            return;
        }
        alert(`${view === 'login' ? 'Login' : 'Sign Up'} Successful! (Mock)`);
        navigate('/');
    };

    const handleGoogleLogin = () => {
        // Simulate OAuth Popup/Redirect
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        // In a real app, this would open the provider's auth page.
        // For mock, we'll just show a confirming alert or simulate a delay.
        const mockWindow = window.open('', 'Google Login', `width=${width},height=${height},top=${top},left=${left}`);
        if (mockWindow) {
            mockWindow.document.write('<h1>Connecting to Google...</h1><p>Please wait...</p>');
            setTimeout(() => {
                mockWindow.close();
                alert("Successfully connected with Google! (Mock)");
                navigate('/candidates'); // Assuming candidate role default
            }, 1500);
        } else {
            alert("Popup blocked! Please allow popups for login.");
        }
    };

    const handleLinkedinLogin = () => {
        // Simulate OAuth Popup/Redirect
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const mockWindow = window.open('', 'LinkedIn Login', `width=${width},height=${height},top=${top},left=${left}`);
        if (mockWindow) {
            mockWindow.document.write('<h1>Connecting to LinkedIn...</h1><p>Please wait...</p>');
            setTimeout(() => {
                mockWindow.close();
                alert("Successfully connected with LinkedIn! (Mock)");
                navigate('/candidates');
            }, 1500);
        } else {
            alert("Popup blocked! Please allow popups for login.");
        }
    };

    const isLogin = view === 'login';
    const isSignup = view === 'signup';
    const isForgot = view === 'forgot';

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-surface-muted relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto"
                >
                    {/* Auth Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">

                        {/* Header / Toggle */}
                        <div className="p-8 pb-0">
                            <div className="flex justify-center mb-8">
                                <Link to="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                        M
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-primary">
                                        Mind the Job
                                    </span>
                                </Link>
                            </div>

                            {!isForgot && (
                                <div className="bg-surface-muted p-1 rounded-2xl flex relative mb-8">
                                    <motion.div
                                        className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-sm z-0"
                                        initial={false}
                                        animate={{
                                            x: isLogin ? '0%' : '100%',
                                            width: 'calc(50% - 4px)'
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                    <button
                                        onClick={() => setView('login')}
                                        className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${isLogin ? 'text-primary' : 'text-gray-400'}`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setView('signup')}
                                        className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${isSignup ? 'text-primary' : 'text-gray-400'}`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-primary">
                                    {isForgot ? 'Reset Password' : (isLogin ? 'Welcome Back!' : 'Join Mind the Job')}
                                </h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    {isForgot
                                        ? 'Enter your email to receive a reset link'
                                        : (isLogin
                                            ? 'Enter your credentials to access your account'
                                            : 'Start your journey towards a smarter career today')}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-4">
                            <AnimatePresence mode='wait'>
                                {isSignup && (
                                    <motion.div
                                        key="fullname"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-1"
                                    >
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full bg-surface-muted border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:outline-none rounded-2xl py-3 pl-12 pr-4 transition-all"
                                                value={formData.fullname}
                                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full bg-surface-muted border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:outline-none rounded-2xl py-3 pl-12 pr-4 transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {!isForgot && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                                        {isLogin && <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-secondary hover:underline">Forgot?</button>}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-surface-muted border-2 border-transparent focus:border-secondary/20 focus:bg-white focus:outline-none rounded-2xl py-3 pl-12 pr-4 transition-all"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {isSignup && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">I am a...</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'candidate' })}
                                            className={`flex-1 py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${formData.role === 'candidate' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-gray-100 text-gray-400'}`}
                                        >
                                            <User size={20} />
                                            <span className="text-xs font-bold">Candidate</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'employer' })}
                                            className={`flex-1 py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${formData.role === 'employer' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-gray-100 text-gray-400'}`}
                                        >
                                            <Briefcase size={20} />
                                            <span className="text-xs font-bold">Employer</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-base mt-4 flex items-center justify-center gap-2 group"
                            >
                                {isForgot ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Button>

                            {!isForgot && (
                                <>
                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-100"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-gray-400 font-bold tracking-wider">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 active:scale-95"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            Google
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLinkedinLogin}
                                            className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 active:scale-95"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#0A66C2">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                            LinkedIn
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>

                        <div className="p-8 bg-surface-muted/50 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                {isForgot ? (
                                    <button onClick={() => setView('login')} className="text-secondary font-bold hover:underline">
                                        Back to Login
                                    </button>
                                ) : (
                                    <>
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            onClick={() => setView(isLogin ? 'signup' : 'login')}
                                            className="text-secondary font-bold ml-1 hover:underline"
                                        >
                                            {isLogin ? 'Sign up now' : 'Log in instead'}
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
