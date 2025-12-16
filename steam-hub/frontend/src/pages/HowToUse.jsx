import React from 'react';

const HowToUse = () => {
    return (
        <div className="bg-[#101010] min-h-screen text-white pt-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 border-b-8 border-[#8000FF] pb-4 inline-block">
                    How to Use
                </h1>

                <div className="space-y-12">
                    <section className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 hover:border-[#8000FF]/50 transition-colors">
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-[#8000FF] mb-4">1. Download the Launcher</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Get started by downloading the official SteamHUB launcher. It's your gateway to the entire library of premium titles.
                        </p>
                    </section>

                    <section className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 hover:border-[#8000FF]/50 transition-colors">
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-[#8000FF] mb-4">2. Create an Account</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Sign up for a free Social Club account to link your games, track stats, and join the community.
                        </p>
                    </section>

                    <section className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 hover:border-[#8000FF]/50 transition-colors">
                        <h2 className="text-2xl font-bold uppercase tracking-wide text-[#8000FF] mb-4">3. Install & Play</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Browse the store, purchase your favorite titles, and start installing immediately. The cloud saves will keep your progress safe.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HowToUse;
