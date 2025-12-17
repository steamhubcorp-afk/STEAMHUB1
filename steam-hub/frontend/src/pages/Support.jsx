import React, { useState } from 'react';
import { MessageSquare, HelpCircle, FileText, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Support = () => {
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

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
                    <div
                        className="bg-[#1a1a1a] p-8 rounded hover:bg-[#222] transition-colors cursor-pointer border-t-4 border-red-500"
                        onClick={() => setIsTicketModalOpen(true)}
                    >
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

            {/* Ticket Modal */}
            {isTicketModalOpen && (
                <TicketModal onClose={() => setIsTicketModalOpen(false)} />
            )}
        </div>
    );
};

const TicketModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // null, 'success', 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await axios.post('http://localhost:3000/api/support/ticket', formData);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus(null);
                setFormData({ email: '', subject: '', message: '' });
            }, 2000);
            toast.success('Ticket submitted successfully!');
        } catch (error) {
            console.error('Error submitting ticket:', error);
            setStatus('error');
            toast.error(error.response?.data?.message || 'Failed to submit ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h3 className="text-xl font-bold uppercase flex items-center gap-2">
                        <FileText className="text-red-500" /> Submit a Ticket
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-2xl font-bold mb-2">Ticket Received</h4>
                            <p className="text-gray-400">We'll get back to you shortly at {formData.email}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="Need help with..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                                    placeholder="Describe your issue in detail..."
                                ></textarea>
                            </div>

                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    <span>Something went wrong. Please try again.</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        Send Ticket <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
)

export default Support;
