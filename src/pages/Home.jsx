import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Search, Briefcase, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClientLogos } from '../components/home/ClientLogos';
import { JobSearch } from '../components/home/JobSearch';
import { Testimonials } from '../components/home/Testimonials';
import { candidateInventory } from '../data/candidateInventory';

export const Home = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="file:///C:/Users/yeasi/.gemini/antigravity/brain/e3f37b07-894d-4758-b374-a58139559b55/modern_recruitment_office_hero_1769469012989.png"
                        alt="Office Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-muted via-white/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={stagger}
                        className="space-y-6 z-10"
                    >

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-primary leading-tight">
                            We help companies hire the <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">right people</span>.
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-text-muted max-w-lg">
                            A smart hiring platform powered by human expertise. No resumes, just shortlisted talent.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/companies">
                                <Button variant="primary" className="text-lg px-8 w-full sm:w-auto">Hire Talent</Button>
                            </Link>
                            <Link to="/candidates">
                                <Button variant="outline" className="text-lg px-8 w-full sm:w-auto">Join Talent Pool</Button>
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="pt-8 flex items-center gap-4 text-sm text-text-muted">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                                        <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p><strong>15,000+</strong> Vetted Candidates Ready to be Hired</p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden md:block"
                    >
                        {/* Abstract visual composition */}
                        <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-md mx-auto transform rotate-2">
                            {/* Dynamic Candidate Sticker */}
                            {(() => {
                                const candidate = candidateInventory[0]; // Select the first candidate or implement logic to rotate/select
                                return (
                                    <>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-primary overflow-hidden border-2 border-primary/10 bg-primary/5">
                                                {candidate.image ? (
                                                    <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Briefcase size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">{candidate.role}</h3>
                                                <p className="text-sm text-gray-500">{candidate.location} • {candidate.salary}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 bg-gray-100 rounded-full w-3/4"></div>
                                            <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                                        </div>
                                        <div className="mt-6 flex justify-between items-center">
                                            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">MATCH: {candidate.match}%</span>
                                            <Button variant="primary" className="px-4 py-2 text-sm h-auto">View Candidate</Button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="mt-6 text-center"
                        >
                            <div className="inline-block px-6 py-3 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 text-secondary-dark rounded-full font-medium text-sm transform rotate-2">
                                🚀 The intelligent way to hire
                            </div>
                        </motion.div>

                        {/* Background decorative elements */}
                        <div className="absolute top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
                    </motion.div>
                </div>
            </section>

            {/* NEW: Client Logos Section */}
            <ClientLogos />

            {/* Highlights Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why top companies choose us?</h2>
                        <p className="text-lg text-text-muted">We combine human intuition with powerful technology to find the perfect match.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users size={32} />,
                                title: "Headhunting Experts",
                                desc: "Our recruiters don't just wait for applications; they proactively hunt the best passive talent.",
                                color: "bg-blue-50 hover:bg-blue-100/50",
                                iconColor: "text-blue-600 bg-blue-100",
                                link: "/about"
                            },
                            {
                                icon: <Search size={32} />,
                                title: "LinkedIn-Powered",
                                desc: "We leverage deep networks and advanced search to find candidates you won't see on job boards.",
                                color: "bg-purple-50 hover:bg-purple-100/50",
                                iconColor: "text-purple-600 bg-purple-100",
                                link: "/candidates"
                            },
                            {
                                icon: <CheckCircle size={32} />,
                                title: "Pre-Vetted Shortlists",
                                desc: "Save hours. We interview and verify every candidate before you even see their profile.",
                                color: "bg-teal-50 hover:bg-teal-100/50",
                                iconColor: "text-teal-600 bg-teal-100",
                                link: "/companies"
                            }
                        ].map((item, idx) => (
                            <Link key={idx} to={item.link} className="block group">
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className={`p-8 rounded-2xl ${item.color} transition-all duration-300 border border-transparent hover:shadow-lg h-full flex flex-col`}
                                >
                                    <div className={`w-14 h-14 rounded-xl ${item.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{item.desc}</p>
                                    <div className="flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                                        <span className={item.iconColor.split(" ")[0]}>Learn more</span>
                                        <ArrowRight size={16} className={`ml-2 ${item.iconColor.split(" ")[0]}`} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Job Search Section */}
            <JobSearch />

            {/* Testimonials Section */}
            <Testimonials />

            {/* CTA Band */}
            <section className="py-20 bg-primary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to find your next star?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Start hiring better, faster, and smarter today. No long contracts, just results.</p>
                    <Link to="/companies">
                        <Button variant="secondary" className="px-10 py-4 text-lg">Start Hiring Now <ArrowRight className="ml-2" size={20} /></Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};
