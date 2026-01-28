import { motion } from 'framer-motion';

const logos = [
    { name: 'Google', domain: 'google.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'Spotify', domain: 'spotify.com' },
    { name: 'Netflix', domain: 'netflix.com' },
    { name: 'Tesla', domain: 'tesla.com' },
    { name: 'Adobe', domain: 'adobe.com' },
    { name: 'Salesforce', domain: 'salesforce.com' },
];

export const ClientLogos = () => {
    return (
        <div className="py-16 bg-white border-b border-gray-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <p className="text-xl font-bold text-primary uppercase tracking-widest">Trusted by industry leaders</p>
            </div>

            <div className="flex relative">
                <motion.div
                    className="flex gap-20 items-center whitespace-nowrap px-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40
                    }}
                >
                    {/* Double the list for seamless loop */}
                    {[...logos, ...logos].map((logo, idx) => (
                        <div
                            key={idx}
                            className="group flex flex-col items-center justify-center cursor-pointer w-32 h-24 relative transition-transform duration-300 hover:scale-110"
                        >
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
                                alt={`${logo.name} logo`}
                                className="w-16 h-16 object-contain filter drop-shadow-sm mb-2"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.querySelector('.fallback-text').style.display = 'block';
                                }}
                            />
                            {/* Optional: Show name on very small logos or hover? Let's just keep clean images mostly. 
                   Actually, favicons can be just icons (like the 'A' for Adobe). 
                   Let's add the text name below securely or on hover if needed. 
                   For now, the user requested LOGOS. Google returns good recognizable ones.
               */}
                            <span className="fallback-text hidden font-bold text-xl text-gray-400">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
