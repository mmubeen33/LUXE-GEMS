import React, { useEffect } from 'react';

const AboutUs = ({ content }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Use admin-provided content if available, otherwise use default
    const hasCustomContent = content && content.trim().length > 0;

    if (hasCustomContent) {
        return (
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto min-h-screen">
                <h1 className="text-4xl md:text-5xl font-serif text-[#2d2926] mb-2 text-center uppercase tracking-widest relative inline-block w-full">
                    About Us
                    <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#d4af37]"></span>
                </h1>
                <p className="text-center text-gray-500 text-xs md:text-sm mt-8 mb-16 tracking-widest uppercase">Our Story & Mission</p>
                
                <div className="mt-12 text-gray-700 leading-relaxed font-sans text-sm md:text-base prose prose-sm max-w-none
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#2d2926] [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-serif
                    [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#2d2926] [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:font-serif
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_ul]:ml-4 [&_ul]:mb-4
                    [&_li]:mb-2
                    [&_strong]:text-[#2d2926] [&_strong]:font-bold
                    ql-editor px-0" 
                    dangerouslySetInnerHTML={{ __html: content }} 
                />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif text-[#2d2926] mb-8 text-center uppercase tracking-widest relative inline-block w-full">
                About Us
                <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#d4af37]"></span>
            </h1>

            <div className="mt-16 space-y-12 text-gray-700 leading-relaxed font-sans text-sm md:text-base">
                <section className="text-center max-w-3xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-[#2d2926] mb-6 uppercase tracking-widest font-serif text-[#8a7322]">Crafting Trust, One Karat at a Time</h2>
                    <p className="text-lg text-gray-600 italic mb-8 border-l-4 border-[#d4af37] pl-6 text-left">
                        Welcome to LUXE GEMS, where the timeless elegance of gold meets modern-day reliability. Based in the heart of Pakistan, we are more than just an online jewelry store; we are your trusted partners in precious metal investments and artisanal craftsmanship.
                    </p>
                </section>

                <div className="w-full h-[1px] bg-gray-200 my-10"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2d2926] mb-6 uppercase tracking-widest font-serif">Our Story</h2>
                        <p className="mb-4">
                            The journey of LUXE GEMS began with a simple realization: buying gold should be as transparent as the shine of the metal itself.
                        </p>
                        <p>
                            In an industry often clouded by hidden charges and uncertain purity, we set out to build a platform where every Pakistani can invest in gold with 100% confidence. From delicate bridal sets to 24K investment bars, we bring the bazaar's finest quality directly to your digital screen.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2d2926] mb-6 uppercase tracking-widest font-serif relative z-10">Our Mission</h2>
                        <p className="relative z-10">
                            Our mission is to democratize gold ownership. We want to make gold accessible, affordable, and safe for everyone—whether you are a groom looking for the perfect wedding band, a mother saving for her daughter's future, or an investor looking to hedge against inflation.
                        </p>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-gray-200 my-10"></div>

                <section>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2d2926] mb-8 text-center uppercase tracking-widest font-serif">Why Choose Us?</h2>
                    <p className="text-center text-gray-500 mb-10">In the world of gold, reputation is everything. We have built ours on three unbreakable pillars:</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-16 h-16 bg-[#2d2926] text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-bold">1</div>
                            <h3 className="text-lg font-bold text-[#2d2926] mb-4 uppercase tracking-wider">Uncompromising Purity</h3>
                            <p className="text-sm text-gray-600">Every piece we sell is hallmarked and accompanied by a Certificate of Authenticity. Whether it is 21K, 22K, or 24K, what you see on the certificate is exactly what you hold in your hand.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-16 h-16 bg-[#2d2926] text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-bold">2</div>
                            <h3 className="text-lg font-bold text-[#2d2926] mb-4 uppercase tracking-wider">Transparent Pricing</h3>
                            <p className="text-sm text-gray-600">We believe in fair trade. Our prices are synced with the Live International Gold Market, ensuring you get the most value for your money without any hidden markups.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-16 h-16 bg-[#2d2926] text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-bold">3</div>
                            <h3 className="text-lg font-bold text-[#2d2926] mb-4 uppercase tracking-wider">Security Beyond Borders</h3>
                            <p className="text-sm text-gray-600">We are pioneers in Insured Gold Shipping. We understand the anxiety of ordering high-value items online, which is why we take full responsibility for your package until it is safely signed for by you.</p>
                        </div>
                    </div>
                </section>

                <div className="bg-[#2d2926] text-white p-10 md:p-16 rounded-3xl mt-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#d4af37]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-widest font-serif relative z-10 text-[#d4af37]">The LUXE GEMS Promise</h2>
                    <p className="mb-8 max-w-2xl mx-auto text-gray-300 relative z-10">When you choose us, you aren't just a customer; you become part of a legacy. We promise a shopping experience that is:</p>

                    <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 relative z-10 font-sans tracking-wide uppercase text-sm font-bold">
                        <span className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-[#d4af37] rounded-full"></span> Human-Centric</span>
                        <span className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-[#d4af37] rounded-full"></span> Secure</span>
                        <span className="flex items-center justify-center gap-2"><span className="w-2 h-2 bg-[#d4af37] rounded-full"></span> Exceptional</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
