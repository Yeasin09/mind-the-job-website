import { motion } from 'framer-motion';

export const About = () => {
    return (
        <div className="min-h-screen bg-surface-muted pt-40 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Driven by People, Powered by Tech</h1>
                        <p className="text-xl text-text-muted">We are rewriting the rules of recruitment to create a fairer, faster, and more human experience for everyone.</p>
                    </motion.div>

                    <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">Our Story</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            Mind the Job was born from a simple frustration: hiring is broken. Resumes get lost in black holes, companies are flooded with irrelevant applications, and the human connection—the most important part—is lost.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We believe there is a better way. By combining the empathy of expert headhunters with the efficiency of modern technology, we match not just skills, but cultures. We don't just fill seats; we build teams.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-primary text-white rounded-3xl p-8 md:p-12">
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-blue-100 text-lg">To empower every individual to find work that matters, and every company to build teams that thrive.</p>
                        </div>
                        <div className="bg-secondary text-white rounded-3xl p-8 md:p-12">
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-teal-100 text-lg">A world where talent is recognized instantly, and the right opportunity is always just one click away.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
