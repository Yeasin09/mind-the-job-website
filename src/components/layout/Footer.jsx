import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="bg-white p-2 rounded-xl inline-block mb-6">
                            <img src="/logo.png" alt="Mind the Job" className="h-20 w-auto" />
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We help companies hire the right people for the right job. Powered by data, driven by people.
                        </p>
                        <div className="flex gap-4">
                            {/* Facebook */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer group">
                                <Facebook size={20} className="text-white group-hover:text-white" />
                            </a>

                            {/* YouTube */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer group">
                                <Youtube size={20} className="text-white group-hover:text-white" />
                            </a>

                            {/* TikTok (Custom SVG) */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white group-hover:text-white"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </a>

                            {/* X (Custom SVG) */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white group-hover:text-white"
                                >
                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer group">
                                <Linkedin size={20} className="text-white group-hover:text-white" />
                            </a>

                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-secondary">For Companies</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li><Link to="/companies" className="hover:text-white transition-colors">Browse Talent</Link></li>
                            <li><Link to="/companies" className="hover:text-white transition-colors">Post a Job</Link></li>
                            <li><Link to="/companies" className="hover:text-white transition-colors">Executive Search</Link></li>
                            <li><Link to="/companies" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-secondary">For Candidates</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li><Link to="/" className="hover:text-white transition-colors">Find a Job</Link></li>
                            <li><Link to="/candidates" className="hover:text-white transition-colors">Submit CV</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Career Advice</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Salary Guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-secondary">Contact</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li>13 Lanark Square, London, E14 9QD</li>
                            <li><a href="mailto:info@mindthejob.com" className="hover:text-white transition-colors">info@mindthejob.com</a></li>
                            <li>+44 (0) 7956 063717</li>
                            <li><Link to="/contact" className="text-secondary hover:text-white font-medium transition-colors">Send us a message &rarr;</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Mind the Job. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                        <Link to="/privacy" className="hover:text-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
