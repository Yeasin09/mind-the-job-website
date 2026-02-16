import { useState, useEffect } from 'react';
import { X, HardHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ConstructionBanner = ({ onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full z-[60] bg-secondary text-white px-4 py-3 shadow-md flex justify-between items-center h-12">
            <div className="container mx-auto flex items-center justify-center gap-3">
                <HardHat size={20} className="text-yellow-300 animate-pulse" />
                <p className="text-sm font-bold tracking-wide text-center">
                    <span className="hidden sm:inline">🚧 </span>
                    Mind the Job is currently under construction. Full launch coming soon!
                    <span className="hidden sm:inline"> 🚧</span>
                </p>
            </div>
            <button
                onClick={onClose}
                className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close banner"
            >
                <X size={18} />
            </button>
        </div>
    );
};
