import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Simplified for debugging and stability
export const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <div className="min-h-screen pt-32 pb-20 text-center container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
                <p className="text-gray-500 mb-8">We couldn't find the article with ID: {id}</p>
                <Link to="/blog">
                    <Button>Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-muted pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link to="/blog" className="inline-flex items-center text-secondary font-medium mb-8 hover:underline">
                    <ArrowLeft size={18} className="mr-2" /> Back to Articles
                </Link>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    {/* Header Image Area */}
                    <div className="h-64 md:h-80 bg-gradient-to-r from-primary to-blue-900 relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-2xl text-white">
                            <div className="flex items-center gap-4 text-sm font-medium mb-3 opacity-90">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">{post.tag}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {post.updated}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
                        </div>
                    </div>



                    {/* Content */}
                    <div className="p-8 md:p-12 text-lg text-gray-700 leading-relaxed space-y-6">
                        {/* Fallback if prose plugin fails */}
                        <div
                            dangerouslySetInnerHTML={{ __html: post.content }}
                            className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6"
                        />
                    </div>

                    <div className="bg-gray-50 p-8 border-t border-gray-100 mt-8 text-center">
                        <h3 className="text-xl font-bold text-primary mb-2">Enjoyed this read?</h3>
                        <p className="text-gray-500 mb-6">Join our newsletter to get the latest hiring trends delivered.</p>
                        <div className="flex justify-center gap-4">
                            <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-secondary" />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
