import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Contact = () => {
    return (
        <div className="min-h-screen bg-surface-muted pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
                    <p className="text-text-muted">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Our Office</h4>
                                        <p className="text-gray-500">13 Lanark Square<br />London, United Kingdom<br />E14 9QD</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email</h4>
                                        <p className="text-gray-500">info@mindthejob.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Phone</h4>
                                        <p className="text-gray-500">+44 (0) 7956 063717</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-12">
                <div className="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4">
                    <Mail size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We'll get back to you shortly.</p>
                <Button onClick={() => setStatus('idle')} variant="outline">Send Another</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Your Name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="your@email.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary h-32"
                    placeholder="How can we help?"
                ></textarea>
            </div>
            <Button className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
            {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}
        </form>
    );
};

