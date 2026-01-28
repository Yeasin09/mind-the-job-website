import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogData';

export const Blog = () => {
    return (
        <div className="min-h-screen bg-surface-muted pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">Industry Insights</h1>
                    <p className="text-text-muted">Expert advice, trends, and strategies for the modern workforce.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogPosts.map((article, idx) => (
                        <Link key={article.id} to={`/blog/${article.id}`} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${idx === 0 ? 'from-primary to-blue-600' : idx === 1 ? 'from-secondary to-teal-600' : 'from-accent to-purple-600'} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-primary">
                                        {article.tag}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <Clock size={12} /> {article.updated}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{article.title}</h3>
                                    <p className="text-gray-500 mb-6 line-clamp-3 flex-grow">{article.excerpt}</p>
                                    <span className="inline-flex items-center text-secondary font-bold text-sm mt-auto">
                                        Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
