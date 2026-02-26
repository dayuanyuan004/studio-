
import React, { useState } from 'react';
import { ChevronLeft, MessageCircle, Send, ArrowUpRight, ArrowDownLeft, Clock, ChevronRight } from 'lucide-react';

interface CommentsProps {
  onBack: () => void;
  sentComments?: any[]; 
  onNavigate?: (page: string, id?: string) => void;
}

const Comments: React.FC<CommentsProps> = ({ onBack, sentComments = [], onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Mock Data for Received with workId mapping
  const receivedComments = [
      { id: 'c1', user: '徐涛', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XuTao', content: '这个动作编排太棒了！求教程！', time: '10分钟前', workTitle: 'Galbot 迎宾舞蹈', workId: 'f1' },
      { id: 'c2', user: '钟海琳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhongHaiLin', content: '节奏卡得很准，收藏了。', time: '2小时前', workTitle: '机械舞步教学', workId: 'f2' },
      { id: 'c3', user: '吴东', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WuDong', content: '我也想买一台 R1 了，看起来很好玩。', time: '1天前', workTitle: '开场演艺模版', workId: 'f5' },
  ];

  const handleReply = (id: string) => {
      if (replyId === id) {
          setReplyId(null); // Close
      } else {
          setReplyId(id);
          setReplyText('');
      }
  };

  const submitReply = () => {
      alert(`回复内容: ${replyText}`);
      setReplyId(null);
      setReplyText('');
  };

  const handleNavigateToWork = (workId?: string) => {
      if (workId && onNavigate) {
          onNavigate('creative-preview', workId);
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-white relative">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20 shadow-lg">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <h1 className="ml-2 font-black text-xl tracking-tight uppercase">我的评论</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 mx-5 mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
         <button 
           onClick={() => setActiveTab('received')}
           className={`flex-1 py-2 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center space-x-2 ${activeTab === 'received' ? 'bg-blue-500/20 text-blue-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
         >
           <ArrowDownLeft className="w-3 h-3" />
           <span>我收到的</span>
         </button>
         <button 
           onClick={() => setActiveTab('sent')}
           className={`flex-1 py-2 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center space-x-2 ${activeTab === 'sent' ? 'bg-cyan-500/20 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
         >
           <ArrowUpRight className="w-3 h-3" />
           <span>我发出的</span>
         </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-5 pb-10 space-y-4">
          {activeTab === 'received' ? (
              receivedComments.map(item => (
                  <div key={item.id} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-sm animate-in slide-in-from-bottom-2">
                      <div className="flex items-start space-x-4">
                          <div className="relative">
                              <img src={item.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-[#1A1A1A] object-cover border border-white/10" />
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 w-4 h-4 rounded-full border-2 border-[#0C0C0C]"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                  <h3 className="font-black text-sm text-slate-200">{item.user}</h3>
                                  <div className="flex items-center text-[9px] font-bold text-slate-600">
                                      <Clock className="w-2.5 h-2.5 mr-1" />
                                      {item.time}
                                  </div>
                              </div>
                              <p className="mt-2 text-sm font-medium text-white/90 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                                  {item.content}
                              </p>
                              
                              <div className="mt-3 flex items-center justify-between">
                                  <button 
                                    onClick={() => handleNavigateToWork(item.workId)}
                                    className="flex items-center text-[10px] font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 max-w-[150px] hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 transition-all group active:scale-95"
                                  >
                                      <span className="truncate">来自: {item.workTitle}</span>
                                      <ChevronRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                  <button 
                                    onClick={() => handleReply(item.id)}
                                    className="text-[10px] font-black text-blue-400 hover:text-blue-300 flex items-center bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 active:scale-95 transition-all"
                                  >
                                      <MessageCircle className="w-3 h-3 mr-1.5" /> 回复
                                  </button>
                              </div>

                              {/* Reply Input */}
                              {replyId === item.id && (
                                  <div className="mt-4 flex space-x-2 animate-in fade-in slide-in-from-top-2">
                                      <input 
                                        type="text" 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="回复评论..."
                                        autoFocus
                                        className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2.5 text-xs font-bold text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
                                      />
                                      <button 
                                        onClick={submitReply}
                                        className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center active:scale-95 shadow-lg shadow-blue-900/30"
                                      >
                                          <Send className="w-4 h-4" />
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              sentComments.map(item => (
                  <div key={item.id} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-sm animate-in slide-in-from-bottom-2">
                      <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                              <Send className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">To: @{item.targetUser}</span>
                                  <span className="text-[9px] font-bold text-slate-600">{item.time}</span>
                              </div>
                              <p className="text-sm font-medium text-white/80 leading-relaxed mb-3">
                                  {item.content}
                              </p>
                              <div className="flex items-center">
                                  <button 
                                    onClick={() => handleNavigateToWork(item.workId)}
                                    className="flex items-center text-[10px] font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 transition-all group active:scale-95"
                                  >
                                      <span>在作品: {item.workTitle}</span>
                                      <ChevronRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default Comments;
