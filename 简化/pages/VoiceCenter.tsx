import React, { useState } from 'react';
import { ChevronLeft, Mic, Upload, Search, Play, Pause, FileAudio, Wand2, Keyboard, Save, Star, MoreHorizontal } from 'lucide-react';

interface VoiceCenterProps {
  onBack: () => void;
}

const VoiceCenter: React.FC<VoiceCenterProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'square' | 'mine'>('square');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [ttsText, setTtsText] = useState('');

  // Mock Data
  const [voiceList, setVoiceList] = useState([
    { id: 'v1', title: '欢迎光临', text: '欢迎光临 Galbot 体验店', duration: '00:03', type: 'online', mood: '热情', isCollected: false },
    { id: 'v2', title: '介绍产品', text: '这是我们最新的 R1 机器人...', duration: '00:15', type: 'online', mood: '专业', isCollected: false },
    { id: 'v3', title: '告别语', text: '期待您的下次光临', duration: '00:05', type: 'online', mood: '亲切', isCollected: true },
    { id: 'v4', title: '引导路线', text: '请跟我往这边走', duration: '00:04', type: 'online', mood: '服务', isCollected: false },
    { id: 'v5', title: '我的录音 01', text: '自定义录音内容...', duration: '00:10', type: 'local', mood: '默认', isCollected: false },
  ]);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const toggleCollect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setVoiceList(prev => prev.map(item => 
        item.id === id ? { ...item, isCollected: !item.isCollected } : item
    ));
  };

  const displayList = voiceList.filter(item => {
      if (activeTab === 'square') return item.type === 'online';
      // In Mine tab, we show local items. 
      // Note: Typically Creation tools generate local items. 
      // Collected online items could also be shown here if desired, but prompt emphasized "Creation (Top) + Local Voice Cards (Bottom)"
      // Let's include collected items too for consistency with Music Center, but visually distinct.
      if (activeTab === 'mine') return item.type === 'local' || item.isCollected;
      return false;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-2 font-bold text-lg">语音中心</h1>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 pb-0 bg-slate-900 sticky top-[57px] z-20">
         <button 
           onClick={() => setActiveTab('square')}
           className={`mr-6 pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'square' ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent'}`}
         >
           素材广场
         </button>
         <button 
           onClick={() => setActiveTab('mine')}
           className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'mine' ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent'}`}
         >
           我的素材
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
          
          {/* --- TAB: My Materials (Creation + List) --- */}
          {activeTab === 'mine' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  
                  {/* Part 1: Creation Tools */}
                  <div className="space-y-4">
                      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                          <Wand2 className="w-3 h-3 mr-1" /> 语音创作
                      </h2>
                      
                      {/* TTS Input */}
                      <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 shadow-sm">
                          <div className="flex items-center mb-3 text-cyan-400">
                              <Keyboard className="w-5 h-5 mr-2" />
                              <h3 className="font-bold text-sm">文字转语音 (TTS)</h3>
                          </div>
                          <textarea 
                            value={ttsText}
                            onChange={(e) => setTtsText(e.target.value)}
                            placeholder="输入您想让机器人说的话..." 
                            className="w-full h-24 bg-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                          />
                          <div className="flex justify-between items-center mt-3">
                              <div className="flex space-x-2">
                                  <button className="text-[10px] bg-slate-800 px-2 py-1 rounded border border-white/10 text-slate-300 hover:text-white">音色: 甜美</button>
                              </div>
                              <button className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center hover:bg-cyan-600 hover:text-white transition-colors">
                                  生成
                              </button>
                          </div>
                      </div>

                      {/* Audio Recorder Compact */}
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center">
                               <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                                   <Mic className="w-5 h-5 text-red-500" />
                               </div>
                               <div>
                                   <h3 className="text-sm font-bold text-white">录制新语音</h3>
                                   <p className="text-[10px] text-slate-500">点击开始录制</p>
                               </div>
                          </div>
                          <button className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          </button>
                      </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/5 w-full"></div>

                  {/* Part 2: Local List */}
                  <div>
                      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                          <span><FileAudio className="w-3 h-3 mr-1 inline" /> 我的语音库</span>
                      </h2>

                      {/* Upload Button (In List) */}
                      <button className="w-full mb-3 bg-white/5 border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center space-x-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-[0.99]">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">上传语音文件</span>
                      </button>

                      <div className="space-y-3">
                        {displayList.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => togglePlay(item.id)}
                                className={`w-full bg-slate-900 rounded-xl p-3 border flex items-center justify-between group active:scale-[0.99] transition-all ${playingId === item.id ? 'border-green-500/50 bg-green-900/10' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${playingId === item.id ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                                        {playingId === item.id ? (
                                            <Pause className="w-3 h-3 fill-current" />
                                        ) : (
                                            <Play className="w-3 h-3 fill-current ml-0.5" />
                                        )}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="flex items-center">
                                            <h4 className={`font-bold text-sm truncate max-w-[120px] ${playingId === item.id ? 'text-green-400' : 'text-slate-200'}`}>{item.title}</h4>
                                            {item.isCollected && item.type === 'online' && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 ml-1.5" />}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{item.text}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs text-slate-500 font-mono">{item.duration}</span>
                                    {/* Action Menu Trigger (Visual only) */}
                                    <div className="p-1 text-slate-600 hover:text-white" onClick={(e) => e.stopPropagation()}>
                                        <MoreHorizontal className="w-4 h-4" />
                                    </div>
                                </div>
                            </button>
                        ))}
                      </div>
                  </div>
              </div>
          )}

          {/* --- TAB: Material Square (Online) --- */}
          {activeTab === 'square' && (
             <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="搜索在线语音包..." 
                        className="w-full bg-slate-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                
                <div className="space-y-3">
                    {displayList.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => togglePlay(item.id)}
                            className={`w-full bg-slate-900 rounded-xl p-4 border flex items-center justify-between group active:scale-[0.99] transition-all ${playingId === item.id ? 'border-green-500/50 bg-green-900/10' : 'border-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex items-center space-x-4 overflow-hidden">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${playingId === item.id ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                                    {playingId === item.id ? (
                                        <Pause className="w-4 h-4 fill-current" />
                                    ) : (
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                    )}
                                </div>
                                <div className="text-left min-w-0">
                                    <h4 className={`font-bold text-sm truncate ${playingId === item.id ? 'text-green-400' : 'text-slate-200'}`}>{item.title}</h4>
                                    <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[150px]">{item.text}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2 shrink-0">
                                <div 
                                    onClick={(e) => toggleCollect(e, item.id)}
                                    className="p-1"
                                >
                                    <Star className={`w-4 h-4 ${item.isCollected ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600 hover:text-yellow-500'}`} />
                                </div>
                                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">{item.mood}</span>
                            </div>
                        </button>
                    ))}
                </div>
             </div>
          )}
      </div>
    </div>
  );
};

export default VoiceCenter;