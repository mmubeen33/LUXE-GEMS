import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const SizeChart = ({ content }) => {
    useEffect(() => window.scrollTo(0, 0), []);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 bg-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#2d2926] mb-2 uppercase tracking-widest relative inline-block">
                        Size Guide
                        <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#d4af37]"></span>
                    </h1>
                    <p className="text-center text-gray-500 text-xs md:text-sm mt-8 tracking-widest uppercase">Find Your Perfect Fit</p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 font-sans text-sm md:text-base leading-relaxed mb-16
                    [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#2d2926] [&_h4]:mt-6 [&_h4]:mb-3
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    "
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="bg-gray-50 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex justify-center overflow-hidden">
                    <img src="https://i.postimg.cc/Gtc2MwDR/size-guide.png" alt="LUXE GEMS Size Guide" className="max-w-full h-auto object-contain shadow-md rounded-xl" style={{ maxHeight: '80vh' }} />
                </div>

                <div className="mt-16 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm text-[#d4af37] mb-4">
                        <span className="flex items-center justify-center">
                            <Info size={20} />
                        </span>
                    </div>
                    <h3 className="text-lg font-serif tracking-widest uppercase text-[#2d2926] mb-2">Still Unsure?</h3>
                    <p className="text-gray-500 text-sm">If you need further assistance finding your size, our customer care team is always here to help. <br />Reach out to us on WhatsApp.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default SizeChart;
