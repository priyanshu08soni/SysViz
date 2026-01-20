import React, { useState } from 'react';
import { Send, MessageSquare, Activity } from 'lucide-react';
import { useDiagramStore } from '../store/useDiagramStore';

const DiscussionPanel: React.FC = () => {
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'activity'>('chat');
    const { messages, sendMessage, remoteUsers, activityLog } = useDiagramStore();

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="w-80 glass flex flex-col border-l border-white/5 h-full z-20 overflow-hidden bg-background">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted">
                    <MessageSquare size={14} />
                    Discussion
                </div>
                <div className="flex -space-x-2">
                    {remoteUsers.map((user) => (
                        <div
                            key={user.id}
                            className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold shadow-sm"
                            style={{ backgroundColor: user.color, color: '#fff' }}
                            title={user.name}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted">
                        +1
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 text-[11px] font-bold uppercase tracking-wider">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted hover:text-foreground hover:bg-white/5'}`}
                >
                    <MessageSquare size={12} /> Chat
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === 'activity' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted hover:text-foreground hover:bg-white/5'}`}
                >
                    <Activity size={12} /> Activity
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'chat' ? (
                    /* CHAT VIEW */
                    messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <MessageSquare size={40} className="mb-4 text-muted" />
                            <p className="text-xs font-medium text-muted">No discussions yet.<br />Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.user === 'Me' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-muted uppercase">{msg.user}</span>
                                    <span className="text-[10px] text-muted/50">{msg.timestamp}</span>
                                </div>
                                <div className={`px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${msg.user === 'Me' ? 'bg-primary text-white rounded-tr-none shadow-sm' : 'bg-secondary text-gray-300 rounded-tl-none border border-white/5'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    /* ACTIVITY VIEW */
                    activityLog?.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <Activity size={40} className="mb-4 text-muted" />
                            <p className="text-xs font-medium text-muted">No activity recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activityLog?.map((log, idx) => (
                                <div key={idx} className="flex gap-3 text-xs text-muted items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Input Area (Only for Chat) */}
            {activeTab === 'chat' && (
                <div className="p-3 bg-white/[0.02] border-t border-white/5">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="w-full bg-secondary border border-white/10 rounded-lg py-2.5 pl-3 pr-10 text-xs text-gray-300 focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-1.5 top-1.5 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscussionPanel;
