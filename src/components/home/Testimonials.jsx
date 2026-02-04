import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        quote: "Mind the Job transformed our hiring process. They found us candidates who weren't just skilled, but perfectly aligned with our company culture.",
        author: "James Wilson",
        role: "Director of Operations",
        company: "Apex Logistics Solutions",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 2,
        quote: "We struggled to find specialized talent for months. Their team understood our technical requirements immediately and delivered results in record time.",
        author: "Sarah Chen",
        role: "Head of Product",
        company: "TechFlow Innovations",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 3,
        quote: "Professional, reliable, and incredibly efficient. They are more than a recruitment agency; they are strategic partners in our growth.",
        author: "Michael Ross",
        role: "Managing Director",
        company: "Summit Event Group",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-surface-muted relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-primary mb-6">What our clients say about us</h2>
                    <p className="text-lg text-text-muted">
                        Trusted by the world's most innovative companies to build their teams.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative group"
                        >
                            <div className="absolute top-6 right-6 text-gray-100 group-hover:text-secondary/20 transition-colors">
                                <Quote size={48} fill="currentColor" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
                                "{item.quote}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <img
                                    src={item.image}
                                    alt={item.author}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                                />
                                <div>
                                    <h4 className="font-bold text-primary">{item.author}</h4>
                                    <p className="text-xs text-secondary font-medium uppercase tracking-wide">{item.company}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
