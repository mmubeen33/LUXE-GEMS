import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const BoxCare = ({ content }) => {
    useEffect(() => window.scrollTo(0, 0), []);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif text-[#2d2926] mb-2 text-center uppercase tracking-widest relative inline-block w-full">
                Jewelry Care
                <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#d4af37]"></span>
            </h1>
            <p className="text-center text-gray-500 text-xs md:text-sm mt-8 mb-16 tracking-widest uppercase">Keep Your Treasures Pristine</p>
            
            <div className="mt-12 text-gray-700 leading-relaxed font-sans text-sm md:text-base prose prose-sm max-w-none
                [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#2d2926] [&_h4]:mt-6 [&_h4]:mb-3
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:ml-4 [&_ul]:mb-4
                [&_li]:mb-2
                ql-editor px-0" 
                dangerouslySetInnerHTML={{ __html: content }} 
            />
        </motion.div>
    );
};

export default BoxCare;
