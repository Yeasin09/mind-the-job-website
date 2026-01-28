import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, DollarSign, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

const jobsData = [
    { id: 1, title: 'Senior Product Designer', company: 'TechCorp', location: 'London', type: 'Permanent', salary: '£75k - £90k', tags: ['Figma', 'UX'] },
    { id: 2, title: 'React Developer', company: 'StartUp Inc', location: 'Remote', type: 'Contract', salary: '£450/day', tags: ['React', 'TypeScript'] },
    { id: 3, title: 'Marketing Manager', company: 'Growthly', location: 'Manchester', type: 'Permanent', salary: '£55k - £65k', tags: ['SEO', 'Content'] },
    { id: 4, title: 'DevOps Engineer', company: 'CloudSystems', location: 'Remote', type: 'Permanent', salary: '£80k - £100k', tags: ['AWS', 'Terraform'] },
    { id: 5, title: 'HR Coordinator', company: 'PeopleFirst', location: 'London', type: 'Contract', salary: '£30k - £35k', tags: ['HRIS', 'Admin'] },
];

export const JobSearch = () => {
    const [filterLoc, setFilterLoc] = useState('All');
    const [filterType, setFilterType] = useState('All');

    const filteredJobs = jobsData.filter(job => {
        const matchLoc = filterLoc === 'All' || job.location === filterLoc;
        const matchType = filterType === 'All' || job.type === filterType;
        return matchLoc && matchType;
    });

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl p-8 md:p-12 mb-10 shadow-2xl shadow-primary/20 relative overflow-hidden border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="flex flex-col items-center text-center relative z-10 text-white space-y-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold mb-4">Latest Opportunities</h2>
                            <p className="text-gray-300">Explore roles curated for your skillset. We vet every company.</p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-3 w-full">
                            <select
                                className="px-5 py-3 rounded-lg border-none bg-white/10 text-white backdrop-blur placeholder-gray-400 focus:bg-white/20 focus:ring-2 focus:ring-secondary outline-none cursor-pointer hover:bg-white/15 transition-colors"
                                value={filterLoc}
                                onChange={(e) => setFilterLoc(e.target.value)}
                            >
                                <option value="All" className="text-black">All Locations</option>
                                <option value="London" className="text-black">London</option>
                                <option value="Remote" className="text-black">Remote</option>
                                <option value="Manchester" className="text-black">Manchester</option>
                            </select>
                            <select
                                className="px-5 py-3 rounded-lg border-none bg-white/10 text-white backdrop-blur placeholder-gray-400 focus:bg-white/20 focus:ring-2 focus:ring-secondary outline-none cursor-pointer hover:bg-white/15 transition-colors"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All" className="text-black">All Types</option>
                                <option value="Permanent" className="text-black">Permanent</option>
                                <option value="Contract" className="text-black">Contract</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <AnimatePresence>
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-100"
                            >
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary hover:text-secondary cursor-pointer transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> {job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{job.type}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="hidden md:flex gap-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="text-xs border border-gray-200 px-2 py-1 rounded-full text-gray-500">{tag}</span>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full md:w-auto">View Role</Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <Filter size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No jobs found matching your filters.</p>
                            <button onClick={() => { setFilterLoc('All'); setFilterType('All') }} className="text-secondary font-bold mt-2 hover:underline">Clear Filters</button>
                        </div>
                    )}
                </div>

                <div className="text-center mt-12">
                    <Button variant="primary" className="px-12">View All 42 Jobs</Button>
                </div>
            </div>
        </section>
    );
};
