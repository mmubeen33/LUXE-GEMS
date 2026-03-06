import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Faqs = ({ content }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = (() => {
        try {
            return content ? JSON.parse(content) : [];
        } catch (e) {
            return [];
        }
    })();

    const [openIndex, setOpenIndex] = useState(`0-0`);

    const toggleFaq = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="pt-32 pb-20 px-4 md:px-12 lg:px-24 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-3xl md:text-5xl font-serif text-[#2d2926] mb-4 text-center uppercase tracking-widest relative inline-block w-full">
                Frequently Asked Questions
                <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#d4af37]"></span>
            </h1>
            <p className="text-center text-gray-500 text-xs md:text-sm mt-8 mb-16 tracking-widest uppercase">Everything you need to know</p>

            <div className="space-y-12">
                {faqs.map((category, catIdx) => (
                    <div key={catIdx} className="mb-10">
                        <h2 className="text-xl md:text-2xl font-serif text-[#2d2926] mb-6 border-b border-gray-200 pb-3">{category.section}</h2>
                        <div className="space-y-4">
                            {category.items.map((item, itemIdx) => {
                                const idx = `${catIdx}-${itemIdx}`;
                                const isOpen = openIndex === idx;

                                return (
                                    <div key={idx} className={`border ${isOpen ? 'border-[#d4af37] bg-[#fcfbf9]' : 'border-gray-200 bg-white'} rounded-xl overflow-hidden transition-all duration-300 shadow-sm`}>
                                        <button
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                                        >
                                            <span className="font-bold text-[#2d2926] text-sm md:text-base pr-4">{item.q}</span>
                                            {isOpen ? <ChevronUp className="text-[#d4af37] shrink-0" size={20} /> : <ChevronDown className="text-gray-400 shrink-0" size={20} />}
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="px-5 pb-5 text-sm text-gray-600 leading-relaxed"
                                                >
                                                    <div className="pt-2 border-t border-gray-100 mt-2">
                                                        {item.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faqs;
