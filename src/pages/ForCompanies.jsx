import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { CheckCircle, Briefcase, TrendingUp, Shield, Clock, DollarSign, MapPin, Plus, User, Lock } from 'lucide-react';

const Step1RoleType = ({ onNext }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
        <h3 className="text-2xl font-bold text-primary">What you're hiring for?</h3>
        <div className="grid md:grid-cols-3 gap-4">
            {[
                { id: 'posting', title: "Job Posting", desc: "Standard listing for active candidates", icon: <Briefcase /> },
                { id: 'headhunt', title: "Headhunting", desc: "We actively approach passive talent", icon: <SearchIcon /> },
                { id: 'confidential', title: "Confidential", desc: "Hiring for a sensitive role?", icon: <Shield /> }
            ].map((opt) => (
                <button key={opt.id} onClick={() => onNext({ type: opt.id })} className="p-6 border-2 border-gray-100 rounded-xl hover:border-secondary hover:bg-secondary/5 text-left transition-all group">
                    <div className="mb-4 text-primary group-hover:text-secondary">{opt.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{opt.title}</h4>
                    <p className="text-sm text-text-muted">{opt.desc}</p>
                </button>
            ))}
        </div>
    </motion.div>
);

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;


const Step2Details = ({ onNext, onBack }) => {
    const [urgency, setUrgency] = useState('normal');
    const [culture, setCulture] = useState(50); // 0 = Strict, 100 = Flexible/Fun
    const [roleTitle, setRoleTitle] = useState('');
    const [location, setLocation] = useState('London');
    const [salaryMin, setSalaryMin] = useState(60);
    const [salaryMax, setSalaryMax] = useState(80);

    // Dynamic salary insight based on title
    const getSalaryInsight = () => {
        const title = roleTitle.toLowerCase();
        if (title.includes('sales') || title.includes('business')) return { range: '£45k - £80k + OTE', role: 'Sales Roles' };
        if (title.includes('marketing') || title.includes('social')) return { range: '£40k - £65k', role: 'Marketing Roles' };
        if (title.includes('manager') || title.includes('lead')) return { range: '£70k - £110k', role: 'Leadership Roles' };
        if (title.includes('engineer') || title.includes('developer')) return { range: '£60k - £95k', role: 'Tech Roles' };
        return { range: '£50k - £75k', role: 'Similar Roles' };
    };

    const insight = getSalaryInsight();

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Role Details</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Job Title</label>
                        <input
                            type="text"
                            value={roleTitle}
                            onChange={(e) => setRoleTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                            placeholder="e.g. Senior Product Designer"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-white"
                        >
                            <option>London (Hybrid)</option>
                            <option>London (On-site)</option>
                            <option>Remote (UK)</option>
                            <option>Remote (Global)</option>
                            <option>Manchester</option>
                            <option>Bristol</option>
                        </select>
                    </div>
                </div>

                {/* Urgency Selector */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-3">How urgent is this hire?</label>
                    <div className="flex gap-4">
                        {['Normal', 'Urgent', 'Critical'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setUrgency(level.toLowerCase())}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${urgency === level.toLowerCase()
                                    ? 'border-secondary bg-secondary/10 text-secondary'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                {level === 'Critical' && <Clock className="inline mr-2 w-4 h-4" />}
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-muted p-6 rounded-xl flex items-start gap-4 border border-secondary/10">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-accent">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Market Salary Insight</h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                            For <strong>{insight.role}</strong> in London, the market average is <span className="text-primary font-bold bg-primary/5 px-1 py-0.5 rounded">{insight.range}</span>.
                            {urgency === 'critical' && <span className="block mt-1 text-secondary font-medium text-xs">💡 For critical hires, we recommend offering +10% above market.</span>}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={onBack}>Back</Button>
                <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => onNext({ roleTitle, location, urgency, culture })}
                    disabled={!roleTitle}
                >
                    Post Role & View Candidates
                </Button>
            </div>
        </motion.div>
    );
}

const DashboardSimulation = ({ formData }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h3 className="text-2xl font-bold text-primary">Hiring Dashboard</h3>
                    <p className="text-text-muted text-sm">Welcome back, Rossi</p>
                </div>
                <Button variant="outline" className="text-xs h-9">
                    <Plus className="w-3 h-3 mr-2" /> New Role
                </Button>
            </div>

            <div className="space-y-8">
                {/* Active Role Card */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Just Posted</h4>
                    <div className="bg-white border-2 border-secondary/20 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Pending Review
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-primary mb-1">{formData.roleTitle || 'New Role'}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {formData.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {formData.urgency}</span>
                                </div>
                            </div>
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Live
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            <div className="text-sm">
                                <span className="text-gray-400 block text-xs">Candidates</span>
                                <strong>0</strong> <span className="text-gray-400">Applications</span>
                            </div>
                            <div className="flex-1"></div>
                            <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-secondary/5 h-8 text-xs">Manage Role</Button>
                        </div>
                    </div>
                </div>

                {/* Candidate Pipepline Teaser */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Candidates</h4>
                        <span className="text-xs text-secondary font-bold cursor-pointer hover:underline">View All Matches</span>
                    </div>

                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-70">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 filter blur-[3px] select-none">
                                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <Lock size={12} />
                                    Premium Match
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-primary/5 p-4 rounded-xl mt-4 text-center">
                        <p className="text-sm text-primary font-medium mb-2">We are currently matching candidates to your new role.</p>
                        <p className="text-xs text-text-muted">You will receive your first batch of vetted profiles within 24 hours.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const ForCompanies = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = (data) => {
        setFormData({ ...formData, ...data });
        setStep(step + 1);
    };

    return (
        <div className="min-h-screen bg-surface-muted pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold text-primary mb-4">Company Hiring Dashboard</h1>
                        <p className="text-text-muted">Post a role or request a headhunt in under 2 minutes.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                            <motion.div
                                className="h-full bg-secondary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && <Step1RoleType key="s1" onNext={handleNext} />}
                            {step === 2 && <Step2Details key="s2" onNext={handleNext} onBack={() => setStep(1)} />}
                        </AnimatePresence>

                        {/* Simulated Dashboard View */}
                        {step === 3 && (
                            <DashboardSimulation formData={formData} />
                        )}
                    </div>

                    {/* Simulated Dashboard Stats Below */}
                    {step !== 3 && (
                        <div className="grid md:grid-cols-3 gap-6 mt-12 opacity-50 pointer-events-none filter grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Active Roles</h4>
                                <div className="text-3xl font-bold text-primary">3</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Candidates Interviewing</h4>
                                <div className="text-3xl font-bold text-secondary">12</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Avg. Time to Hire</h4>
                                <div className="text-3xl font-bold text-accent">14 Days</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
