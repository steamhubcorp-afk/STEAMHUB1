import React from 'react';
import { MessageSquare, HelpCircle, FileText } from 'lucide-react';

const Support = () => {
    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white pt-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                    Support Center
                </h1>
                <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
                    How can we help you today? Search our knowledge base or contact our support team.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-[#1a1a1a] p-8 rounded hover:bg-[#222] transition-colors cursor-pointer border-t-4 border-blue-500">
                        <MessageSquare className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold uppercase mb-2">Community Forum</h3>
                        <p className="text-sm text-gray-500">Discuss with other players.</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-8 rounded hover:bg-[#222] transition-colors cursor-pointer border-t-4 border-yellow-500">
                        <HelpCircle className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold uppercase mb-2">Knowledge Base</h3>
                        <p className="text-sm text-gray-500">Find answers to common questions.</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-8 rounded hover:bg-[#222] transition-colors cursor-pointer border-t-4 border-red-500">
                        <FileText className="w-12 h-12 text-red-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold uppercase mb-2">Submit a Ticket</h3>
                        <p className="text-sm text-gray-500">Contact our support team directly.</p>
                    </div>
                </div>

                <div className="text-left">
                    <h2 className="text-2xl font-bold uppercase mb-6 border-b border-gray-800 pb-2">Top Questions</h2>
                    <ul className="space-y-4">
                        {["How to link Social Club account?", "GTA Online Connection Troubleshooting", "Red Dead Redemption 2 PC System Specs", "I lost my login credentials"].map((q, i) => (
                            <li key={i} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded hover:bg-gray-800 cursor-pointer group">
                                <span className="font-medium text-gray-300 group-hover:text-white">{q}</span>
                                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
)

export default Support;
