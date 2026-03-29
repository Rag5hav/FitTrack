import { useState, useRef, useEffect } from 'react';
import { postChatQuery } from '../../services/goal.service';
import { MessageSquare, Send, Sparkles, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am your AI Fitness Coach. Feel free to ask me anything about workouts, diet, or request a custom workout plan!'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const data = await postChatQuery(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that. Please make sure your Gemini API key is configured correctly in the backend." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
                    <Sparkles className="text-purple-400" size={32} />
                    <span>AI Fitness Coach</span>
                </h1>
                <p className="text-textMuted mt-1">Get instant answers, nutrition advice, and custom workout plans formatted just for you.</p>
            </div>

            <div className="flex-1 card flex flex-col p-0 overflow-hidden border-t-4 border-t-purple-500">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600/20 text-purple-400'
                                }`}>
                                    {msg.role === 'user' ? <UserIcon size={16} /> : <MessageSquare size={16} />}
                                </div>
                                
                                <div className={`px-5 py-4 rounded-2xl ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                }`}>
                                    {msg.role === 'user' ? (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        <div className="markdown-body prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-purple-600/20 text-purple-400">
                                    <Sparkles size={16} className="animate-pulse" />
                                </div>
                                <div className="px-5 py-4 rounded-2xl bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Area */}
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <form onSubmit={handleSend} className="flex space-x-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for a workout plan or diet advice..."
                            className="flex-1 bg-slate-800 text-white py-3 px-5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-500"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center space-x-2 shadow-lg shadow-purple-500/20"
                        >
                            <span>Send</span>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
